"use client";
import TakaSymbol from "@/components/ui/TakaSymbol";
import moment from "moment";
import { LuPrinter, LuX } from "react-icons/lu";

const OrderInvoiceModal = ({ ref, order }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!order) return null;

  const isPaid = order.paymentStatus === "paid";

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-3xl bg-white text-black p-8 print:shadow-none print:max-w-full print:w-full print:p-0">
        {/* Top Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 print:hidden">
          <h3 className="font-bold text-lg text-gray-800">Invoice Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn btn-sm btn-main gap-2">
              <LuPrinter /> Print Invoice
            </button>
            <button
              onClick={() => ref.current?.close()}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <LuX />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="space-y-6 text-sm text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-5">
            <div>
              <img
                src="/assets/oiki-logo.svg"
                alt="Oiki Logo"
                className="h-12 w-auto mb-2"
              />
              <p className="font-semibold text-base">Oiki Lifestyle</p>
              <p className="text-xs text-gray-500">
                Handcrafted Bengali Apparel &bull; oiki.store
              </p>
              <p className="text-xs text-gray-500">support@oiki.store</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
                INVOICE
              </h1>
              <p className="font-mono text-xs mt-1">
                <span className="font-semibold">Order ID:</span> #
                {order._id?.toString().slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Date:</span>{" "}
                {moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
              {order.courier?.trackingCode && (
                <p className="text-xs font-mono mt-1 bg-gray-100 px-2 py-0.5 rounded inline-block">
                  <span className="font-semibold">Steadfast Tracking:</span>{" "}
                  {order.courier.trackingCode}
                </p>
              )}
            </div>
          </div>

          {/* Billing / Shipping Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">
                Billed & Shipped To
              </h4>
              <p className="font-bold text-base">{order.customer?.name}</p>
              <p className="text-gray-700">{order.customer?.phone}</p>
              {order.customer?.email && order.customer.email !== "N/A" && (
                <p className="text-gray-600 text-xs">{order.customer.email}</p>
              )}
              <p className="text-gray-700 mt-1 max-w-xs">
                {order.customer?.address}
              </p>
              {order.customer?.comment && (
                <p className="text-xs italic text-gray-500 mt-1">
                  Note: {order.customer.comment}
                </p>
              )}
            </div>
            <div className="text-right">
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">
                Payment Details
              </h4>
              <p>
                <span className="font-semibold">Method:</span>{" "}
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery (COD)"
                  : "Online Payment"}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Payment Status:</span>{" "}
                <span
                  className={`font-bold uppercase px-2 py-0.5 rounded text-xs ${
                    isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {isPaid ? "PAID" : "UNPAID (COLLECT CASH)"}
                </span>
              </p>
              {!isPaid && (
                <div className="mt-3 p-2 border-2 border-gray-800 inline-block rounded">
                  <p className="text-xs uppercase font-semibold">
                    Condition / Collectible Amount
                  </p>
                  <p className="text-lg font-bold">
                    <TakaSymbol />
                    {order.totalPrice}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full border-collapse border border-gray-300 text-left text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase">
                  <th className="border border-gray-300 p-2.5">#</th>
                  <th className="border border-gray-300 p-2.5">Item Description</th>
                  <th className="border border-gray-300 p-2.5">Variant</th>
                  <th className="border border-gray-300 p-2.5 text-center">Qty</th>
                  <th className="border border-gray-300 p-2.5 text-right">Unit Price</th>
                  <th className="border border-gray-300 p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.products || []).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="border border-gray-300 p-2.5">{idx + 1}</td>
                    <td className="border border-gray-300 p-2.5 font-medium">
                      {item.productName}
                    </td>
                    <td className="border border-gray-300 p-2.5">
                      Color: {item.color} | Size: {item.size}
                    </td>
                    <td className="border border-gray-300 p-2.5 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2.5 text-right">
                      <TakaSymbol />
                      {item.price}
                    </td>
                    <td className="border border-gray-300 p-2.5 text-right font-semibold">
                      <TakaSymbol />
                      {item.quantity * Number(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  <TakaSymbol />
                  {order.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge:</span>
                <span>
                  <TakaSymbol />
                  {order.shippingCharge}
                </span>
              </div>
              {(order.discountAmount > 0 || order.discount > 0) && (
                <div className="flex justify-between text-green-700">
                  <span>
                    Discount{order.couponCode ? ` (${order.couponCode})` : ""}:
                  </span>
                  <span>
                    -<TakaSymbol />
                    {order.discountAmount || order.discount}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2">
                <span>Grand Total:</span>
                <span>
                  <TakaSymbol />
                  {order.totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
            Thank you for shopping with Oiki Lifestyle! For exchanges or queries, please contact us within 3 days of delivery.
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default OrderInvoiceModal;

