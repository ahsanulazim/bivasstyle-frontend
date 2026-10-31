"use client";

import { getAllOrderData, sendOrderToCourier } from "@/api/orderApi";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import { LuCheck, LuEye, LuSearch, LuTrash2, LuTruck } from "react-icons/lu";
import OrderDeleteModal from "./OrderDeleteModal";
import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const TABS = [
  { key: "all", label: "All" },
  { key: "unpaid", label: "Unpaid" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return { color: "badge-warning border-warning", dot: "status-warning", label: "Pending" };
    case "confirmed":
      return { color: "badge-info border-info", dot: "status-info", label: "Confirmed" };
    case "processing":
      return { color: "badge-info border-info", dot: "status-info", label: "Processing" };
    case "shipped":
      return { color: "badge-primary border-primary", dot: "status-primary", label: "Shipped" };
    case "delivered":
      return { color: "badge-success border-success", dot: "status-success", label: "Delivered" };
    case "hold":
      return { color: "badge-neutral border-neutral", dot: "status-neutral", label: "On Hold" };
    case "cancelled":
    default:
      return { color: "badge-error border-error", dot: "status-error", label: "Cancelled" };
  }
};

const OrderData = () => {
  const orderRef = useRef(null);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderId, setOrderId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrderData,
  });

  const courierMutation = useMutation({
    mutationFn: sendOrderToCourier,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(res.message || "Sent to Steadfast Courier!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to send order to courier",
      );
    },
  });

  // Tab + Search filtering logic
  const filteredOrders = data?.orders?.filter((order) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "unpaid"
          ? order.paymentStatus !== "paid"
          : activeTab === "pending"
            ? order.status === "pending"
            : activeTab === "completed"
              ? order.status === "delivered"
              : true;

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fullName =
      `${order.customer?.firstName || ""} ${order.customer?.lastName || ""} ${order.customer?.name || ""}`.toLowerCase();
    const phone = (order.customer?.phone || "").toLowerCase();
    const idStr = (order._id || "").toLowerCase();

    return fullName.includes(q) || phone.includes(q) || idStr.includes(q);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div role="tablist" className="tabs tabs-box">
          {TABS.map((tab) => (
            <a
              key={tab.key}
              role="tab"
              onClick={() => setActiveTab(tab.key)}
              className={`tab ${activeTab === tab.key ? "tab-active" : ""}`}
            >
              {tab.label}
            </a>
          ))}
        </div>
        <label className="input rounded-full w-full sm:w-auto">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, ID..."
          />
          <LuSearch className="h-[1em] opacity-50" />
        </label>
      </div>
      <div className="my-5">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Fulfillment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="text-center" colSpan={9}>
                    <span className="loading loading-spinner"></span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="text-center" colSpan={9}>
                    <span className="text-error">Error loading orders</span>
                  </td>
                </tr>
              ) : filteredOrders?.length === 0 ? (
                <tr>
                  <td className="text-center py-8 opacity-60" colSpan={9}>
                    <span>No orders found</span>
                  </td>
                </tr>
              ) : (
                filteredOrders?.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const isPaid = order.paymentStatus === "paid";

                  return (
                    <tr key={order._id}>
                      <td className="font-mono text-xs font-semibold">
                        #{order._id?.toString().slice(-6).toUpperCase()}
                      </td>
                      <td>{moment(order.createdAt).format("MMM DD, YY")}</td>
                      <td>
                        <div className="font-medium">
                          {order.customer?.firstName
                            ? `${order.customer.firstName} ${order.customer.lastName || ""}`
                            : order.customer?.name || "Guest"}
                        </div>
                        <div className="text-xs opacity-60">
                          {order.customer?.phone}
                        </div>
                      </td>
                      <td>
                        {order.paymentMethod === "cod" ? "COD" : "Zinipay"}
                      </td>
                      <td>
                        <div
                          className={`badge ${
                            isPaid ? "badge-success" : "badge-warning"
                          } badge-soft`}
                        >
                          <div
                            className={`status ${
                              isPaid ? "status-success" : "status-warning"
                            }`}
                          ></div>{" "}
                          {isPaid ? "Paid" : "Unpaid"}
                        </div>
                      </td>
                      <td>
                        <TakaSymbol />
                        {order.totalPrice}
                      </td>
                      <td>
                        {(order.products || []).reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </td>
                      <td>
                        <div
                          className={`badge ${statusBadge.color} badge-soft`}
                        >
                          <div className={`status ${statusBadge.dot}`}></div>{" "}
                          {statusBadge.label}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="btn btn-circle btn-sm btn-ghost btn-info"
                            title="View Details"
                          >
                            <LuEye />
                          </Link>
                          <div
                            className="tooltip tooltip-left"
                            data-tip={
                              order.courier?.consignmentId
                                ? `Sent (Code: ${order.courier.trackingCode})`
                                : "Send to Steadfast Courier"
                            }
                          >
                            <button
                              disabled={
                                Boolean(order.courier?.consignmentId) ||
                                courierMutation.isPending ||
                                order.status === "cancelled"
                              }
                              onClick={() => courierMutation.mutate(order._id)}
                              className="btn btn-ghost btn-sm btn-circle btn-success"
                            >
                              {order.courier?.consignmentId ? (
                                <LuCheck />
                              ) : (
                                <LuTruck />
                              )}
                            </button>
                          </div>
                          <button
                            className="btn btn-circle btn-sm btn-ghost btn-error"
                            onClick={() => {
                              setOrderId(order._id);
                              orderRef.current?.showModal();
                            }}
                            title="Delete Order"
                          >
                            <LuTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <OrderDeleteModal id={orderId} ref={orderRef} />
        </div>
      </div>
    </div>
  );
};

export default OrderData;
