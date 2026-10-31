"use client";
import { getAllOrderData } from "@/api/orderApi";
import { MyContext } from "@/context/MyProvider";
import { useSocket } from "@/context/SocketProvider";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useContext } from "react";
import {
  LuActivity,
  LuBox,
  LuClock,
  LuDollarSign,
  LuEye,
  LuShoppingBag,
  LuTriangleAlert,
} from "react-icons/lu";
import TakaSymbol from "../ui/TakaSymbol";

const AdminDashboard = () => {
  const { products = [] } = useContext(MyContext);
  const { isConnected, lastEvent } = useSocket();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrderData,
  });

  const orders = orderData?.orders || [];

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending",
  ).length;

  // Find low stock variants (stock <= 3)
  const lowStockItems = [];
  (products || []).forEach((p) => {
    (p.variantDetails || []).forEach((v) => {
      (v.sizes || []).forEach((s) => {
        if (Number(s.stock) <= 3) {
          lowStockItems.push({
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-2xl">Store Overview</h2>
            <span
              className={`badge badge-xs gap-1 font-medium ${
                isConnected
                  ? "badge-success badge-soft"
                  : "badge-warning badge-soft"
              }`}
            >
              <LuActivity className="size-3" />
              {isConnected ? "Real-time Active" : "Connecting..."}
            </span>
          </div>
          <p className="text-xs opacity-60">
            Real-time summary of Oiki Lifestyle sales, orders, and inventory.
            {lastEvent?.timestamp && (
              <span className="ml-2 text-success font-medium">
                &bull; Last synced {moment(lastEvent.timestamp).format("h:mm:ss A")}
              </span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/products/add-product"
          className="btn btn-sm btn-main"
        >
          + Add New Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Total Sales Volume
            </p>
            <h3 className="text-2xl font-bold mt-1 text-main">
              <TakaSymbol />
              {totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-main/10 text-main">
            <LuDollarSign size={24} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
          </div>
          <div className="p-3 rounded-full bg-info/10 text-info">
            <LuShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Pending Orders
            </p>
            <h3 className="text-2xl font-bold mt-1 text-warning">
              {pendingOrdersCount}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-warning/10 text-warning">
            <LuClock size={24} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Active Products
            </p>
            <h3 className="text-2xl font-bold mt-1">{products?.length || 0}</h3>
          </div>
          <div className="p-3 rounded-full bg-success/10 text-success">
            <LuBox size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-base-100 p-5 rounded-box border border-base-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <Link
              href="/dashboard/orders"
              className="text-xs link text-main font-semibold"
            >
              View All Orders &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      <span className="loading loading-spinner"></span>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 opacity-60">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 6).map((order) => (
                    <tr key={order._id}>
                      <td className="font-mono text-xs font-semibold">
                        #{order._id?.toString().slice(-6).toUpperCase()}
                      </td>
                      <td>
                        {order.customer?.firstName
                          ? `${order.customer.firstName} ${order.customer.lastName || ""}`
                          : order.customer?.name || "Guest"}
                      </td>
                      <td className="text-xs">
                        {moment(order.createdAt).format("MMM DD, YY")}
                      </td>
                      <td className="font-semibold">
                        <TakaSymbol />
                        {order.totalPrice}
                      </td>
                      <td>
                        <span className="badge badge-xs uppercase">
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/dashboard/orders/${order._id}`}
                          className="btn btn-xs btn-ghost btn-circle"
                        >
                          <LuEye />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Card */}
        <div className="lg:col-span-4 bg-base-100 p-5 rounded-box border border-base-300">
          <div className="flex items-center gap-2 mb-4">
            <LuTriangleAlert className="text-warning text-lg" />
            <h3 className="font-bold text-lg">Low Stock Alerts</h3>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="text-xs opacity-60 py-6 text-center">
              All product variants are well-stocked!
            </p>
          ) : (
            <ul className="divide-y divide-base-200 max-h-80 overflow-y-auto text-xs">
              {lowStockItems.slice(0, 12).map((item, idx) => (
                <li
                  key={idx}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div>
                    <Link
                      href={`/dashboard/products/edit-product?slug=${item.slug}`}
                      className="font-semibold hover:text-main"
                    >
                      {item.productName}
                    </Link>
                    <p className="opacity-60">
                      Color: {item.color} &bull; Size: {item.size}
                    </p>
                  </div>
                  <span
                    className={`badge badge-xs font-bold ${
                      item.stock <= 0 ? "badge-error" : "badge-warning"
                    }`}
                  >
                    {item.stock <= 0 ? "Out" : `${item.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
