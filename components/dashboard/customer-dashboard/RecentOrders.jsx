import TakaSymbol from "@/components/ui/TakaSymbol";
import moment from "moment";
import Link from "next/link";
import SettingsCard from "../settings/SettingsCard";

const RecentOrders = ({
  orders = [],
  isLoading,
  selectedOrderId,
  onSelectOrder,
}) => {
  return (
    <SettingsCard title="My Orders">
      {isLoading ? (
        <div className="py-8 text-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <p className="text-sm opacity-70">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn btn-sm btn-main">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Track</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isSelected = selectedOrderId === order._id;
                const totalQty = (order.products || []).reduce(
                  (sum, p) => sum + Number(p.quantity || 1),
                  0,
                );
                return (
                  <tr
                    key={order._id}
                    className={isSelected ? "bg-base-200/70" : ""}
                  >
                    <td className="font-mono text-xs font-semibold">
                      #{order._id?.toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="text-xs">
                      {moment(order.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td>
                      <div className="text-xs font-medium">
                        {order.products?.[0]?.productName}
                        {order.products?.length > 1 &&
                          ` +${order.products.length - 1} more`}
                      </div>
                      <div className="text-[11px] opacity-60">
                        {totalQty} {totalQty === 1 ? "Item" : "Items"}
                      </div>
                    </td>
                    <td className="font-semibold">
                      <TakaSymbol />
                      {order.totalPrice}
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs uppercase font-semibold ${
                          order.status === "delivered"
                            ? "badge-success"
                            : order.status === "cancelled"
                              ? "badge-error"
                              : "badge-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onSelectOrder?.(order._id)}
                        className={`btn btn-xs ${
                          isSelected ? "btn-main" : "btn-outline"
                        }`}
                      >
                        {isSelected ? "Tracking" : "Track"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SettingsCard>
  );
};

export default RecentOrders;
