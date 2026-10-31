import moment from "moment";
import { LuCheck, LuClock, LuExternalLink, LuX } from "react-icons/lu";
import SettingsCard from "../settings/SettingsCard";

const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Order Confirmed" },
  { key: "processing", label: "Packed & Processing" },
  { key: "shipped", label: "Handed Over to Courier" },
  { key: "delivered", label: "Delivered" },
];

const getStepIndex = (status, hasCourier) => {
  if (status === "delivered") return 4;
  if (status === "shipped" || (status === "processing" && hasCourier)) return 3;
  if (status === "processing") return 2;
  if (status === "confirmed") return 1;
  return 0;
};

const OrderTracking = ({ order }) => {
  if (!order) {
    return (
      <SettingsCard title="Order Tracking">
        <p className="text-sm opacity-60 py-4 text-center">
          No active order to track yet.
        </p>
      </SettingsCard>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStep = getStepIndex(
    order.status,
    Boolean(order.courier?.consignmentId),
  );

  return (
    <SettingsCard title="Order Tracking">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-main">
          Order #{order._id?.toString().slice(-8).toUpperCase()}
        </span>
        <span className="opacity-60">
          {moment(order.createdAt).format("MMM DD, YYYY")}
        </span>
      </div>

      {isCancelled ? (
        <div className="alert alert-error text-xs py-2">
          <LuX className="text-base" />
          <span>This order was cancelled.</span>
        </div>
      ) : (
        <ul className="timeline timeline-vertical items-start text-xs">
          {STEPS.map((step, index) => {
            const completed = index <= currentStep;
            return (
              <li key={step.key} className="grid-cols-none!">
                {index > 0 && (
                  <hr className={completed ? "bg-success" : "bg-base-300"} />
                )}
                <div className="timeline-middle">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center ${
                      completed
                        ? "bg-success text-success-content"
                        : "bg-base-300 text-base-content/50"
                    }`}
                  >
                    {completed ? <LuCheck size={12} /> : <LuClock size={12} />}
                  </div>
                </div>
                <div
                  className={`timeline-end timeline-box ${
                    completed ? "border-success/40 font-semibold" : "opacity-50"
                  }`}
                >
                  {step.label}
                </div>
                {index < STEPS.length - 1 && (
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

      {order.courier?.trackingCode && (
        <div className="mt-4 p-3 bg-base-200 rounded-box text-xs space-y-1">
          <p className="font-semibold">
            Courier: {order.courier.provider || "Steadfast"}
          </p>
          <p className="font-mono">
            Tracking Code: {order.courier.trackingCode}
          </p>
          <a
            href={`https://steadfast.com.bd/t/${order.courier.trackingCode}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 link link-primary font-semibold mt-1"
          >
            Live Courier Tracking <LuExternalLink />
          </a>
        </div>
      )}
    </SettingsCard>
  );
};

export default OrderTracking;
