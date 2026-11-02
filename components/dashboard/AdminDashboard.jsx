"use client";
import { getAllOrderData } from "@/api/orderApi";
import { MyContext } from "@/context/MyProvider";
import { useSocket } from "@/context/SocketProvider";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useContext, useMemo } from "react";
import {
  LuActivity,
  LuArrowRight,
  LuBox,
  LuChartColumn,
  LuClock,
  LuEye,
  LuPlus,
  LuShoppingBag,
  LuTag,
  LuTriangleAlert,
  LuWallet,
} from "react-icons/lu";
import TakaSymbol from "../ui/TakaSymbol";
import { getOrderStatusBadge } from "./orders/orderStatus";

const LOW_STOCK_THRESHOLD = 3;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const getCustomerName = (order) =>
  order.customer?.firstName
    ? `${order.customer.firstName} ${order.customer.lastName || ""}`.trim()
    : order.customer?.name || "Guest";

const StatCard = ({ href, label, value, hint, icon: Icon, tone, loading }) => (
  <Link
    href={href}
    className="group bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between gap-3 transition hover:border-main/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-main"
  >
    <div className="min-w-0">
      <p className="text-xs uppercase opacity-60 font-semibold tracking-wide">
        {label}
      </p>
      {loading ? (
        <div className="skeleton h-7 w-24 mt-2"></div>
      ) : (
        <h3 className={`text-2xl font-bold mt-1 truncate ${tone.text}`}>
          {value}
        </h3>
      )}
      {hint && !loading && (
        <p className="text-[11px] opacity-60 mt-0.5 truncate">{hint}</p>
      )}
    </div>
    <div
      className={`p-3 rounded-full shrink-0 transition group-hover:scale-110 ${tone.bg}`}
    >
      <Icon size={22} />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { products = [], newUser } = useContext(MyContext);
  const { isConnected, lastEvent } = useSocket();

  const { data: orderData, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrderData,
  });

  const firstName = newUser?.user?.name?.split(" ")[0];

  const stats = useMemo(() => {
    const orders = [...(orderData?.orders || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const validOrders = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = validOrders.reduce(
      (sum, o) => sum + Number(o.totalPrice || 0),
      0,
    );
    const today = moment().startOf("day");
    const todaysOrders = orders.filter((o) =>
      moment(o.createdAt).isSameOrAfter(today),
    );
    const todaysRevenue = todaysOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const pendingOrdersCount = orders.filter(
      (o) => o.status === "pending",
    ).length;

    return { orders, totalRevenue, todaysOrders, todaysRevenue, pendingOrdersCount };
  }, [orderData]);

  // Find low stock variants, most critical first
  const lowStockItems = useMemo(() => {
    const items = [];
    (products || []).forEach((p) => {
      (p.variantDetails || []).forEach((v) => {
        (v.sizes || []).forEach((s) => {
          if (Number(s.stock) <= LOW_STOCK_THRESHOLD) {
            items.push({
              productName: p.productName,
              slug: p.slug,
              color: v.color,
              size: s.size,
              stock: Number(s.stock),
            });
          }
        });
      });
    });
    return items.sort((a, b) => a.stock - b.stock);
  }, [products]);

  const outOfStockCount = lowStockItems.filter((i) => i.stock <= 0).length;
  const { orders, totalRevenue, todaysOrders, todaysRevenue, pendingOrdersCount } =
    stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-2xl">
              {getGreeting()}
              {firstName ? `, ${firstName}` : ""} 👋
            </h2>
            <span
              className={`badge badge-sm gap-1 font-medium badge-soft ${
                isConnected ? "badge-success" : "badge-warning"
              }`}
            >
              <LuActivity className="size-3" />
              {isConnected ? "Real-time Active" : "Connecting..."}
            </span>
          </div>
          <p className="text-xs opacity-60 mt-0.5">
            Here&apos;s what&apos;s happening with Bivas Style today.
            {lastEvent?.timestamp && (
              <span className="ml-2 text-success font-medium">
                &bull; Last synced {moment(lastEvent.timestamp).format("h:mm:ss A")}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/analytics"
            className="btn btn-sm btn-outline gap-1.5"
          >
            <LuChartColumn className="size-4" /> Full Analytics
          </Link>
          <Link
            href="/dashboard/products/add-product"
            className="btn btn-sm btn-main gap-1.5"
          >
            <LuPlus className="size-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Attention banner – surfaces what needs action right now */}
      {!isLoading && (pendingOrdersCount > 0 || outOfStockCount > 0) && (
        <div role="alert" className="alert alert-warning alert-soft">
          <LuTriangleAlert className="size-5" />
          <div className="text-sm">
            <span className="font-semibold">Needs your attention: </span>
            {pendingOrdersCount > 0 && (
              <span>
                {pendingOrdersCount} pending order
                {pendingOrdersCount > 1 ? "s" : ""} to confirm
              </span>
            )}
            {pendingOrdersCount > 0 && outOfStockCount > 0 && <span> · </span>}
            {outOfStockCount > 0 && (
              <span>
                {outOfStockCount} variant{outOfStockCount > 1 ? "s" : ""} out of
                stock
              </span>
            )}
          </div>
          <Link
            href={pendingOrdersCount > 0 ? "/dashboard/orders?tab=pending" : "/dashboard/products"}
            className="btn btn-sm btn-ghost"
          >
            Review <LuArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {isError && (
        <div role="alert" className="alert alert-error alert-soft">
          <span className="text-sm">Couldn&apos;t load order data.</span>
          <button onClick={() => refetch()} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          href="/dashboard/analytics"
          label="Total Revenue"
          value={
            <>
              <TakaSymbol />
              {formatMoney(totalRevenue)}
            </>
          }
          hint={`Today: ৳${formatMoney(todaysRevenue)} · excl. cancelled`}
          icon={LuWallet}
          tone={{ text: "text-main", bg: "bg-main/10 text-main" }}
          loading={isLoading}
        />
        <StatCard
          href="/dashboard/orders"
          label="Total Orders"
          value={orders.length.toLocaleString()}
          hint={`${todaysOrders.length} placed today`}
          icon={LuShoppingBag}
          tone={{ text: "", bg: "bg-info/10 text-info" }}
          loading={isLoading}
        />
        <StatCard
          href="/dashboard/orders?tab=pending"
          label="Pending Orders"
          value={pendingOrdersCount}
          hint={pendingOrdersCount ? "Awaiting confirmation" : "All caught up 🎉"}
          icon={LuClock}
          tone={{ text: "text-warning", bg: "bg-warning/10 text-warning" }}
          loading={isLoading}
        />
        <StatCard
          href="/dashboard/products"
          label="Active Products"
          value={products?.length || 0}
          hint={
            lowStockItems.length
              ? `${lowStockItems.length} low-stock variant${lowStockItems.length > 1 ? "s" : ""}`
              : "Inventory healthy"
          }
          icon={LuBox}
          tone={{ text: "", bg: "bg-success/10 text-success" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-base-100 p-5 rounded-box border border-base-300 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Recent Orders</h3>
              <p className="text-xs opacity-60">Latest 6 orders across your store</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="btn btn-xs btn-ghost text-main gap-1"
            >
              View all <LuArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th className="text-right">Total</th>
                  <th>Status</th>
                  <th className="sr-only">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6}>
                        <div className="skeleton h-6 w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <LuShoppingBag className="mx-auto size-8 opacity-30" />
                      <p className="mt-2 text-sm opacity-60">No orders yet</p>
                      <p className="text-xs opacity-50">
                        New orders will appear here in real time.
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 6).map((order) => {
                    const badge = getOrderStatusBadge(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-base-200/60">
                        <td className="font-mono text-xs font-semibold">
                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="hover:text-main"
                          >
                            #{order._id?.toString().slice(-6).toUpperCase()}
                          </Link>
                        </td>
                        <td className="max-w-40 truncate">
                          {getCustomerName(order)}
                        </td>
                        <td
                          className="text-xs whitespace-nowrap"
                          title={moment(order.createdAt).format("MMM DD, YYYY h:mm A")}
                        >
                          {moment(order.createdAt).fromNow()}
                        </td>
                        <td className="font-semibold text-right whitespace-nowrap">
                          <TakaSymbol />
                          {formatMoney(order.totalPrice)}
                        </td>
                        <td>
                          <span
                            className={`badge badge-xs badge-soft whitespace-nowrap ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="btn btn-xs btn-ghost btn-circle tooltip tooltip-left"
                            data-tip="View order"
                            aria-label="View order"
                          >
                            <LuEye />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Low Stock Alert Card */}
          <div className="bg-base-100 p-5 rounded-box border border-base-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LuTriangleAlert className="text-warning text-lg" />
                <h3 className="font-bold text-lg">Low Stock</h3>
                {lowStockItems.length > 0 && (
                  <span className="badge badge-sm badge-warning badge-soft">
                    {lowStockItems.length}
                  </span>
                )}
              </div>
              <Link
                href="/dashboard/products"
                className="btn btn-xs btn-ghost text-main"
              >
                Manage
              </Link>
            </div>
            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center">
                <LuBox className="mx-auto size-8 text-success opacity-60" />
                <p className="text-xs opacity-60 mt-2">
                  All product variants are well-stocked!
                </p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-base-200 max-h-80 overflow-y-auto text-xs -mx-1 px-1">
                  {lowStockItems.slice(0, 12).map((item, idx) => (
                    <li
                      key={`${item.slug}-${item.color}-${item.size}-${idx}`}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/products/edit-product?slug=${item.slug}`}
                          className="font-semibold hover:text-main line-clamp-1"
                          title="Edit product to restock"
                        >
                          {item.productName}
                        </Link>
                        <p className="opacity-60">
                          {item.color} &bull; Size {item.size}
                        </p>
                      </div>
                      <span
                        className={`badge badge-xs font-bold shrink-0 ${
                          item.stock <= 0 ? "badge-error" : "badge-warning"
                        }`}
                      >
                        {item.stock <= 0 ? "Out of stock" : `${item.stock} left`}
                      </span>
                    </li>
                  ))}
                </ul>
                {lowStockItems.length > 12 && (
                  <p className="text-[11px] opacity-60 text-center pt-2 border-t border-base-200">
                    +{lowStockItems.length - 12} more variants running low
                  </p>
                )}
              </>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-base-100 p-5 rounded-box border border-base-300">
            <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/dashboard/products/add-product", label: "Add Product", icon: LuPlus },
                { href: "/dashboard/orders", label: "Manage Orders", icon: LuShoppingBag },
                { href: "/dashboard/coupons", label: "Create Coupon", icon: LuTag },
                { href: "/dashboard/analytics", label: "View Reports", icon: LuChartColumn },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-box border border-base-300 p-3 text-xs font-medium text-center transition hover:border-main hover:text-main hover:bg-main/5"
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
