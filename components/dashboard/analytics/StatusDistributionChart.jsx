"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_COLORS = {
  Delivered: "#10B981",
  Processing: "#3B82F6",
  Shipped: "#6366F1",
  Confirmed: "#06B6D4",
  Pending: "#F59E0B",
  Hold: "#6B7280",
  Cancelled: "#EF4444",
};

const StatusDistributionChart = ({ statusData = [] }) => {
  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <h3 className="font-bold text-base mb-1">Order Status Breakdown</h3>
      <p className="text-xs text-base-content/60 mb-4">
        Proportion of orders currently in each lifecycle stage.
      </p>

      {statusData.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-xs opacity-60">
          No status records
        </div>
      ) : (
        <div className="h-64 flex flex-col sm:flex-row items-center justify-between">
          <div className="h-full w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || "#94A3B8"}
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

          {/* Status List Legend */}
          <div className="w-full sm:w-1/2 space-y-2 mt-4 sm:mt-0 text-xs">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[item.name] || "#94A3B8",
                    }}
                  />
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDistributionChart;

