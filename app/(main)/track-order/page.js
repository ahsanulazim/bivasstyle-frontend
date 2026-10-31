"use client";
import { trackPublicOrder } from "@/api/orderApi";
import OrderTracking from "@/components/dashboard/customer-dashboard/OrderTracking";
import TakaSymbol from "@/components/ui/TakaSymbol";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { LuHouse, LuSearch, LuTruck } from "react-icons/lu";

const TrackOrderPage = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setOrders([]);

    try {
      const res = await trackPublicOrder(query.trim());
      if (res.success && res.orders?.length > 0) {
        setOrders(res.orders);
      } else {
        setError("No order found matching your search.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No matching order found. Please check your Order ID or Phone Number.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 py-8 max-w-4xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          <li>Track Order</li>
        </ul>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-6 md:p-8 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex p-3 rounded-full bg-main/10 text-main mb-1">
            <LuTruck size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Track Your Order</h1>
          <p className="text-sm opacity-70">
            Enter your Order ID (e.g. #8F3A12B4), Mobile Phone Number, or
            Steadfast Tracking Code to check live delivery status.
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID, Phone Number, or Tracking Code..."
            className="input input-bordered flex-1"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-main gap-2"
          >
            <LuSearch />
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="alert alert-error mt-6 max-w-lg mx-auto text-sm">
            <span>{error}</span>
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-5 border border-base-300 rounded-box p-4 bg-base-200/30"
              >
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between border-b border-base-300 pb-2">
                    <div>
                      <span className="font-mono font-bold text-main">
                        Order #{order._id?.toString().slice(-8).toUpperCase()}
                      </span>
                      <p className="text-xs opacity-60">
                        Placed on{" "}
                        {moment(order.createdAt).format("MMM DD, YYYY hh:mm A")}
                      </p>
                    </div>
                    <span className="badge badge-outline uppercase text-xs font-semibold">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-xs uppercase opacity-60">
                      Ordered Items
                    </h4>
                    {(order.products || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-base-100 p-2.5 rounded border border-base-200"
                      >
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="opacity-60">
                            Color: {item.color} &bull; Size: {item.size} &bull; Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="font-bold">
                          <TakaSymbol />
                          {item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-base-300 text-sm font-bold">
                    <span>Total Amount ({order.paymentMethod?.toUpperCase()}):</span>
                    <span className="text-main text-base">
                      <TakaSymbol />
                      {order.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <OrderTracking order={order} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrderPage;

