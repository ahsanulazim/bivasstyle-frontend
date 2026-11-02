"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PAYMENT_COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B"];

const PaymentMethodsChart = ({ paymentData = [], totalOrders = 0 }) => {
  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <h3 className="font-bold text-base mb-1">Payment Method Preference</h3>
      <p className="text-xs text-base-content/60 mb-4">
        COD vs Online Gateway share of completed orders.
      </p>

      {paymentData.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-xs opacity-60">
          No payment transactions yet
        </div>
      ) : (
        <div className="h-64 flex flex-col sm:flex-row items-center justify-between">
          <div className="h-full w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} orders`, name]}
                  contentStyle={{
                    borderRadius: "12px",
                    backgroundColor: "#1E293B",
                    color: "#fff",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0 text-xs">
            {paymentData.map((item, idx) => {
              const percentage =
                totalOrders > 0
                  ? Math.round((item.value / totalOrders) * 100)
                  : 0;
              return (
                <div
                  key={idx}
                  className="p-3 bg-base-200/60 rounded-xl space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            PAYMENT_COLORS[idx % PAYMENT_COLORS.length],
                        }}
                      />
                      {item.name}
                    </span>
                    <span>{item.value} orders</span>
                  </div>
                  <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          PAYMENT_COLORS[idx % PAYMENT_COLORS.length],
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-right opacity-60">
                    {percentage}% of total orders
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsChart;

