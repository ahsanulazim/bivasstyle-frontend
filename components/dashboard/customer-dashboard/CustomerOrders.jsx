"use client";

import { getUserOrders } from "@/api/orderApi";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import {
  LuBox,
  LuCheck,
  LuClock,
  LuExternalLink,
  LuEye,
  LuFileBox,
  LuFilter,
  LuPrinter,
  LuSearch,
  LuTruck,
  LuX,
} from "react-icons/lu";
import OrderInvoiceModal from "../orders/order/OrderInvoiceModal";
import Breadcrumbs from "../Breadcrumbs";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "in_progress", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const TRACK_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Handed to Courier" },
  { key: "delivered", label: "Delivered" },
];

const getStepIndex = (status, hasCourier) => {
  if (status === "delivered") return 4;
  if (status === "shipped" || (status === "processing" && hasCourier)) return 3;
  if (status === "processing") return 2;
  if (status === "confirmed") return 1;
  return 0;
};

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return { badge: "badge-warning", label: "Pending" };
    case "confirmed":
      return { badge: "badge-info", label: "Confirmed" };
    case "processing":
      return { badge: "badge-info", label: "Processing" };
    case "shipped":
      return { badge: "badge-primary", label: "Shipped" };
    case "delivered":
      return { badge: "badge-success", label: "Delivered" };
    case "cancelled":
      return { badge: "badge-error", label: "Cancelled" };
    default:
      return { badge: "badge-neutral", label: status || "Unknown" };
  }
};

const CustomerOrders = () => {
  const { newUser } = useContext(MyContext);
  const userId = newUser?.user?._id;
  const email = newUser?.user?.email;

  const invoiceModalRef = useRef(null);
  const trackModalRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["myOrders", userId, email],
    queryFn: () => getUserOrders({ userId, email }),
    enabled: Boolean(userId || email),
  });

  const orders = data?.orders || [];

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === "in_progress") {
      if (!["pending", "confirmed", "processing", "shipped"].includes(order.status)) {
        return false;
      }
    } else if (activeTab === "delivered") {
      if (order.status !== "delivered") return false;
    } else if (activeTab === "cancelled") {
      if (order.status !== "cancelled") return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const id = (order._id || "").toLowerCase();
    const matchesProduct = (order.products || []).some((p) =>
      (p.productName || "").toLowerCase().includes(q),
    );
    return id.includes(q) || matchesProduct;
  });

  const handleOpenInvoice = (order) => {
    setSelectedOrder(order);
    invoiceModalRef.current?.showModal();
  };

  const handleOpenTracking = (order) => {
    setSelectedOrder(order);
    trackModalRef.current?.showModal();
  };

  const currentStep = getStepIndex(
    selectedOrder?.status,
    Boolean(selectedOrder?.courier?.consignmentId),
  );

  return (
    <>
      <Breadcrumbs title="My Orders" />

      {/* Header */}
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LuFileBox className="text-main" /> My Orders ({orders.length})
          </h1>
          <p className="text-xs opacity-65 mt-0.5">
            View order status, download invoices and track courier delivery.
          </p>
        </div>
        <Link href="/products" className="btn btn-sm btn-outline btn-main w-fit">
          <LuBox className="size-4" /> Continue Shopping
        </Link>
      </section>

      {/* Filters & Search */}
      <section className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div role="tablist" className="tabs tabs-box bg-base-100 p-1 border border-base-300 rounded-xl overflow-x-auto">
          {TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? orders.length
                : tab.key === "in_progress"
                  ? orders.filter((o) =>
                      ["pending", "confirmed", "processing", "shipped"].includes(o.status),
                    ).length
                  : orders.filter((o) => o.status === tab.key).length;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`tab text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "tab-active bg-main text-white shadow-xs"
                    : "hover:bg-base-200"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-base-300 text-base-content/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-50" />
          <input
            type="text"
            placeholder="Search by ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-lg text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
            >
              <LuX className="size-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Orders List Content */}
      <section>
        {isLoading ? (
          <div className="bg-base-100 rounded-box border border-base-300 p-16 text-center">
            <span className="loading loading-spinner loading-md text-main"></span>
            <p className="text-xs opacity-60 mt-3">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-base-100 rounded-box border border-base-300 p-12 text-center space-y-4 max-w-lg mx-auto my-6">
            <div className="size-16 rounded-full bg-main/10 text-main flex items-center justify-center mx-auto">
              <LuFileBox className="size-8" />
            </div>
            <h3 className="text-lg font-bold">No Orders Found</h3>
            <p className="text-xs opacity-65">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try a different keyword.`
                : "You don't have any orders under this tab right now."}
            </p>
            <Link href="/products" className="btn btn-sm btn-main">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = getStatusBadge(order.status);
              const totalItems = (order.products || []).reduce(
                (sum, p) => sum + Number(p.quantity || 1),
                0,
              );
              const isPaid = order.paymentStatus === "paid";

              return (
                <div
                  key={order._id}
                  className="bg-base-100 rounded-2xl border border-base-300 p-4 sm:p-5 shadow-xs hover:border-main/40 transition-colors"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-200 pb-3 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-main">
                        Order #{order._id?.toString().slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs opacity-60">
                        {moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`badge badge-sm font-bold uppercase ${status.badge}`}
                      >
                        {status.label}
                      </span>
                      <span
                        className={`badge badge-sm badge-outline font-semibold uppercase ${
                          isPaid ? "badge-success text-success" : "badge-neutral opacity-70"
                        }`}
                      >
                        {isPaid ? "Paid" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>

                  {/* Body: Products & Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Products details */}
                    <div className="md:col-span-7 space-y-3">
                      {(order.products || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="size-14 rounded-lg object-cover bg-base-200 border border-base-300 shrink-0"
                            />
                          ) : (
                            <div className="size-14 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center shrink-0 text-xs font-semibold opacity-60">
                              Item
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-xs sm:text-sm truncate">
                              {item.productName}
                            </h4>
                            <div className="text-[11px] opacity-65 flex flex-wrap gap-2 mt-0.5">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                              <span>Qty: {item.quantity}</span>
                              <span className="font-semibold text-base-content">
                                <TakaSymbol />
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total & Courier Details */}
                    <div className="md:col-span-5 flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 border-base-200 pt-3 md:pt-0">
                      <div className="md:text-right">
                        <span className="text-[11px] opacity-60 block">
                          Total Amount ({totalItems} {totalItems === 1 ? "item" : "items"})
                        </span>
                        <span className="text-xl font-bold text-main">
                          <TakaSymbol />
                          {order.totalPrice}
                        </span>
                        {order.courier?.trackingCode && (
                          <div className="mt-1 text-xs opacity-80">
                            <span className="badge badge-xs badge-ghost font-mono">
                              Steadfast: {order.courier.trackingCode}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenTracking(order)}
                          className="btn btn-xs btn-outline btn-main gap-1.5"
                        >
                          <LuTruck className="size-3.5" /> Track Delivery
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenInvoice(order)}
                          className="btn btn-xs btn-ghost border border-base-300 gap-1.5 hover:bg-base-200"
                        >
                          <LuPrinter className="size-3.5" /> Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Invoice Modal */}
      <OrderInvoiceModal
        modalRef={invoiceModalRef}
        order={selectedOrder}
      />

      {/* Tracking Modal */}
      <dialog ref={trackModalRef} className="modal">
        <div className="modal-box max-w-md bg-base-100 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-base-200">
            <h3 className="font-bold text-base flex items-center gap-2">
              <LuTruck className="text-main" /> Order Tracking
            </h3>
            <button
              onClick={() => trackModalRef.current?.close()}
              className="btn btn-xs btn-circle btn-ghost"
            >
              <LuX />
            </button>
          </div>

          {selectedOrder && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-xs bg-base-200 p-2.5 rounded-lg">
                <span className="font-mono font-bold text-main">
                  #{selectedOrder._id?.toString().slice(-8).toUpperCase()}
                </span>
                <span className="opacity-70">
                  {moment(selectedOrder.createdAt).format("DD MMM YYYY")}
                </span>
              </div>

              {selectedOrder.status === "cancelled" ? (
                <div className="alert alert-error text-xs py-2.5">
                  <LuX className="text-base" />
                  <span>This order was cancelled.</span>
                </div>
              ) : (
                <ul className="timeline timeline-vertical items-start text-xs my-2">
                  {TRACK_STEPS.map((step, index) => {
                    const completed = index <= currentStep;
                    return (
                      <li key={step.key} className="grid-cols-none!">
                        {index > 0 && (
                          <hr
                            className={
                              completed ? "bg-success" : "bg-base-300"
                            }
                          />
                        )}
                        <div className="timeline-middle">
                          <div
                            className={`size-5 rounded-full flex items-center justify-center ${
                              completed
                                ? "bg-success text-success-content"
                                : "bg-base-300 text-base-content/50"
                            }`}
                          >
                            {completed ? (
                              <LuCheck size={12} />
                            ) : (
                              <LuClock size={12} />
                            )}
                          </div>
                        </div>
                        <div
                          className={`timeline-end timeline-box text-xs ${
                            completed
                              ? "border-success/40 font-semibold"
                              : "opacity-50"
                          }`}
                        >
                          {step.label}
                        </div>
                        {index < TRACK_STEPS.length - 1 && (
                          <hr
                            className={
                              index < currentStep ? "bg-success" : "bg-base-300"
                            }
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {selectedOrder.courier?.trackingCode && (
                <div className="p-3 bg-base-200 rounded-xl text-xs space-y-1.5 border border-base-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Courier Provider:</span>
                    <span>{selectedOrder.courier.provider || "Steadfast Courier"}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="opacity-70">Tracking Code:</span>
                    <span className="font-bold">{selectedOrder.courier.trackingCode}</span>
                  </div>
                  <a
                    href={`https://steadfast.com.bd/t/${selectedOrder.courier.trackingCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-xs btn-main w-full mt-2 gap-1"
                  >
                    <LuExternalLink className="size-3" /> Track on Steadfast
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    trackModalRef.current?.close();
                    handleOpenInvoice(selectedOrder);
                  }}
                  className="btn btn-sm btn-outline w-full gap-2"
                >
                  <LuPrinter className="size-3.5" /> View Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default CustomerOrders;
