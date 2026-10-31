"use client";
import {
  getOrderDetails,
  sendOrderToCourier,
  updateOrder,
} from "@/api/orderApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import OrderItems from "@/components/dashboard/orders/order/OrderItems";
import OrderInvoiceModal from "@/components/dashboard/orders/order/OrderInvoiceModal";
import OrderSummary from "@/components/dashboard/orders/order/OrderSummary";
import OrderDataCard from "@/components/dashboard/orders/OrderDataCard";
import Spinner from "@/components/skeleton/Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { use, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuCheck,
  LuExternalLink,
  LuMail,
  LuPhone,
  LuPrinter,
  LuShoppingBasket,
  LuSquarePen,
  LuTruck,
  LuUser,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const OrderDetailsPage = ({ params }) => {
  const { order: orderId } = use(params);
  const queryClient = useQueryClient();
  const invoiceModalRef = useRef(null);
  const contactModalRef = useRef(null);
  const addressModalRef = useRef(null);

  const [contactForm, setContactForm] = useState({ email: "", phone: "" });
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    thana: "",
  });

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetails(orderId),
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderDetails", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully");
      contactModalRef.current?.close();
      addressModalRef.current?.close();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update order");
    },
  });

  const courierMutation = useMutation({
    mutationFn: () => sendOrderToCourier(orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orderDetails", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(res.message || "Sent to Steadfast Courier!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to send to Steadfast Courier",
      );
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!orderData?.success || !orderData?.order) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-xl font-bold text-error">Order Not Found</h3>
        <Link href="/dashboard/orders" className="btn btn-sm btn-main mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = orderData.order;

  const handleStatusChange = (e) => {
    updateMutation.mutate({ orderId, status: e.target.value });
  };

  const handlePaymentStatusChange = (e) => {
    updateMutation.mutate({ orderId, paymentStatus: e.target.value });
  };

  const handleCancelOrder = () => {
    if (order.status === "cancelled") return;
    updateMutation.mutate({ orderId, status: "cancelled" });
  };

  const openContactModal = () => {
    setContactForm({
      email: order.customer?.email === "N/A" ? "" : order.customer?.email || "",
      phone: order.customer?.phone === "N/A" ? "" : order.customer?.phone || "",
    });
    contactModalRef.current?.showModal();
  };

  const openAddressModal = () => {
    setAddressForm({
      firstName: order.customer?.firstName || "",
      lastName: order.customer?.lastName || "",
      address: order.customer?.rawAddress || order.customer?.address || "",
      thana: order.customer?.thana || "",
    });
    addressModalRef.current?.showModal();
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      orderId,
      customer: {
        email: contactForm.email,
        phone: contactForm.phone,
      },
    });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      orderId,
      customer: {
        firstName: addressForm.firstName,
        lastName: addressForm.lastName,
        address: addressForm.address,
        thana: addressForm.thana,
      },
    });
  };

  return (
    <>
      <Breadcrumbs title="Orders" subtitle="Order Details" />

      <section className="mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/orders">
              <button className="btn btn-square">
                <LuArrowLeft />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">
                  Order #{order._id?.toString().slice(-8).toUpperCase()}
                </h2>
                <span className="badge badge-outline uppercase text-xs">
                  {order.status}
                </span>
              </div>
              <p className="opacity-50 text-xs">
                Created at{" "}
                {moment(order.createdAt).format("MMM DD, YYYY hh:mm A")}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Order Status Select */}
            <select
              value={order.status || "pending"}
              onChange={handleStatusChange}
              disabled={updateMutation.isPending}
              className="select select-sm select-bordered font-medium"
            >
              <option value="pending">Status: Pending</option>
              <option value="confirmed">Status: Confirmed</option>
              <option value="processing">Status: Processing</option>
              <option value="shipped">Status: Shipped</option>
              <option value="delivered">Status: Delivered</option>
              <option value="hold">Status: On Hold</option>
              <option value="cancelled">Status: Cancelled</option>
            </select>

            {/* Payment Status Select */}
            <select
              value={order.paymentStatus === "paid" ? "paid" : "unpaid"}
              onChange={handlePaymentStatusChange}
              disabled={updateMutation.isPending}
              className="select select-sm select-bordered font-medium"
            >
              <option value="unpaid">Payment: Unpaid</option>
              <option value="paid">Payment: Paid</option>
            </select>

            {/* Print Invoice Button */}
            <button
              onClick={() => invoiceModalRef.current?.showModal()}
              className="btn btn-sm btn-outline gap-1.5"
            >
              <LuPrinter /> Print Invoice
            </button>

            {/* Cancel Order Button */}
            {order.status !== "cancelled" && (
              <button
                onClick={handleCancelOrder}
                disabled={updateMutation.isPending}
                className="btn btn-sm btn-error gap-1.5"
              >
                <LuX /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-5">
            <OrderItems order={order} />
            <OrderSummary order={order} />
          </div>

          <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-5">
            {/* Customer Card */}
            <OrderDataCard>
              <h3 className="p-4 pb-2 font-semibold">Customer</h3>
              <ul className="flex flex-col gap-1 p-4 pt-0 opacity-70 text-sm">
                <li className="flex items-center gap-2">
                  <LuUser />
                  <span>{order.customer?.name}</span>
                </li>
                <li className="flex items-center gap-2">
                  <LuShoppingBasket />
                  <span>
                    {order.products?.length || 0}{" "}
                    {order.products?.length === 1 ? "Item" : "Items"}
                  </span>
                </li>
              </ul>
            </OrderDataCard>

            {/* Courier / Steadfast Card */}
            <OrderDataCard>
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold">Courier (Steadfast)</h3>
                {!order.courier?.consignmentId && (
                  <button
                    onClick={() => courierMutation.mutate()}
                    disabled={
                      courierMutation.isPending || order.status === "cancelled"
                    }
                    className="btn btn-xs btn-success gap-1"
                  >
                    <LuTruck />
                    {courierMutation.isPending ? "Sending..." : "Send Parcel"}
                  </button>
                )}
              </div>
              <div className="p-4 pt-0 text-sm">
                {order.courier?.consignmentId ? (
                  <div className="space-y-1 text-xs bg-success/10 border border-success/30 p-3 rounded-box">
                    <div className="flex items-center gap-1.5 font-semibold text-success">
                      <LuCheck /> Sent to Steadfast
                    </div>
                    <p>
                      <span className="opacity-70">Consignment ID:</span>{" "}
                      <span className="font-mono font-semibold">
                        {order.courier.consignmentId}
                      </span>
                    </p>
                    <p>
                      <span className="opacity-70">Tracking Code:</span>{" "}
                      <span className="font-mono font-semibold">
                        {order.courier.trackingCode}
                      </span>
                    </p>
                    <a
                      href={`https://steadfast.com.bd/t/${order.courier.trackingCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 link link-primary mt-1 font-medium"
                    >
                      Track on Steadfast <LuExternalLink />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs opacity-60">
                    Not handed over to courier yet. Click &quot;Send Parcel&quot;
                    to book on Steadfast.
                  </p>
                )}
              </div>
            </OrderDataCard>

            {/* Contact Info Card */}
            <OrderDataCard>
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="tooltip tooltip-left" data-tip="Edit Contact">
                  <button
                    onClick={openContactModal}
                    className="btn btn-sm btn-square btn-info"
                  >
                    <LuSquarePen />
                  </button>
                </div>
              </div>
              <ul className="flex flex-col gap-1 p-4 pt-0 opacity-70 text-sm">
                <li className="flex items-center gap-2">
                  <LuMail className="shrink-0" />
                  <span className="truncate">
                    {order.customer?.email || "No Email Provided"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <LuPhone className="shrink-0" />
                  <span>
                    {order.customer?.phone || "No Phone Number Provided"}
                  </span>
                </li>
              </ul>
            </OrderDataCard>

            {/* Shipping Address Card */}
            <OrderDataCard>
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-semibold">Shipping Address</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="tooltip tooltip-left"
                    data-tip="Change Address"
                  >
                    <button
                      onClick={openAddressModal}
                      className="btn btn-sm btn-square btn-info"
                    >
                      <LuSquarePen />
                    </button>
                  </div>
                </div>
              </div>
              <ul className="flex flex-col gap-1 p-4 pt-0 opacity-70 text-sm">
                <li className="flex items-start gap-2">
                  <LuTruck className="shrink-0 mt-1" />
                  <span>{order.customer?.address}</span>
                </li>
              </ul>
            </OrderDataCard>
          </div>
        </div>
      </section>

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal ref={invoiceModalRef} order={order} />

      {/* Edit Contact Modal */}
      <dialog ref={contactModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Contact Information</h3>
          <form onSubmit={handleSaveContact} className="fieldset space-y-3">
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm((p) => ({ ...p, email: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => contactModalRef.current?.close()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn btn-main"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Shipping Address Modal */}
      <dialog ref={addressModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Shipping Address</h3>
          <form onSubmit={handleSaveAddress} className="fieldset space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  value={addressForm.firstName}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  value={addressForm.lastName}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="input w-full"
                />
              </div>
            </div>
            <div>
              <label className="label">Street Address</label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm((p) => ({ ...p, address: e.target.value }))
                }
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="label">Upazilla / Thana</label>
              <input
                type="text"
                value={addressForm.thana}
                onChange={(e) =>
                  setAddressForm((p) => ({ ...p, thana: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => addressModalRef.current?.close()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn btn-main"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default OrderDetailsPage;
