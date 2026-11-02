"use client";

import {
  LuCircleAlert,
  LuCircleX,
  LuClock,
  LuFilter,
  LuPackageCheck,
  LuShoppingBag,
  LuTruck,
} from "react-icons/lu";

const STAGE_ICONS = {
  "Placed Orders": LuShoppingBag,
  "Confirmed & In-Prep": LuClock,
  "Dispatched / In-Transit": LuTruck,
  "Delivered Successfully": LuPackageCheck,
};

const STAGE_COLORS = {
  "Placed Orders": "from-blue-500 to-blue-600",
  "Confirmed & In-Prep": "from-cyan-500 to-cyan-600",
  "Dispatched / In-Transit": "from-indigo-500 to-indigo-600",
  "Delivered Successfully": "from-emerald-500 to-emerald-600",
};

const OrderFunnelChart = ({ orderFunnel = [], kpis = {} }) => {
  const deliveryRate = kpis.deliverySuccessRate || 0;
  const returnRate = kpis.returnOrCancelRate || 0;

  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Order Fulfillment Funnel</h3>
            <span className="badge badge-success badge-soft font-semibold text-xs">
              {deliveryRate}% Final Conversion
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-0.5">
            Conversion stages from customer checkout to completed delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-success font-medium">
            <LuCircleAlert className="size-3.5" /> {kpis.deliveredOrders || 0}{" "}
            Delivered
          </span>
          <span className="text-base-content/30">•</span>
          <span className="flex items-center gap-1 text-error font-medium">
            <LuCircleX className="size-3.5" /> {kpis.cancelledOrders || 0}{" "}
            Cancelled / Drop
          </span>
        </div>
      </div>

      {orderFunnel.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs opacity-60">
          No order funnel data in this range
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {orderFunnel.map((stage, idx) => {
              const Icon = STAGE_ICONS[stage.stage] || LuFilter;
              const bgGradient =
                STAGE_COLORS[stage.stage] || "from-primary to-primary-focus";

              return (
                <div
                  key={idx}
                  className="bg-base-200/50 p-4 rounded-xl border border-base-300/40 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="size-8 rounded-lg bg-base-100 text-base-content flex items-center justify-center shadow-xs">
                        <Icon className="size-4 text-main" />
                      </div>
                      <span className="font-extrabold text-sm font-mono text-base-content/80">
                        {stage.percentage}%
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-base-content line-clamp-1">
                      {stage.stage}
                    </h4>
                    <p className="text-[11px] text-base-content/60 mt-0.5">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xl font-extrabold text-base-content">
                        {stage.count}
                      </span>
                      <span className="text-[11px] opacity-60">
                        {idx === 0
                          ? "100% Volume"
                          : `${stage.percentage}% of Initial`}
                      </span>
                    </div>

                    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${bgGradient} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(5, stage.percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Funnel Conversion Summary Bar */}
          <div className="p-3 bg-base-200/40 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base-content/70">
                Fulfillment Health:
              </span>
              <span
                className={`badge badge-sm font-semibold ${
                  deliveryRate >= 80
                    ? "badge-success"
                    : deliveryRate >= 60
                      ? "badge-warning"
                      : "badge-error"
                }`}
              >
                {deliveryRate >= 80
                  ? "Excellent Conversion"
                  : deliveryRate >= 60
                    ? "Moderate Conversion"
                    : "High Cancellation Risk"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs opacity-75">
              <span>
                Dispatched-to-Delivered:{" "}
                <strong>
                  {kpis.shippedOrders + kpis.deliveredOrders > 0
                    ? Math.round(
                        (kpis.deliveredOrders /
                          (kpis.shippedOrders + kpis.deliveredOrders)) *
                          100,
                      )
                    : 0}
                  %
                </strong>
              </span>
              <span>
                Cancellation Loss: <strong>{returnRate}%</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFunnelChart;
