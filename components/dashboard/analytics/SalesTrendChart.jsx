"use client";

import moment from "moment";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LuPackage, LuTrendingUp } from "react-icons/lu";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 p-3 rounded-xl shadow-lg border border-base-300 text-xs space-y-1">
        <p className="font-semibold text-base-content/70">
          {moment(label).format("ddd, MMM DD, YYYY")}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="font-bold flex items-center gap-1.5"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span>
              {entry.name.toLowerCase().includes("revenue") ? "৳" : ""}
              {Number(entry.value).toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesTrendChart = ({ timelineData = [], isLoading }) => {
  const [chartView, setChartView] = useState("revenue"); // "revenue" | "orders"

  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <LuTrendingUp className="text-main" /> Sales & Revenue Trends
          </h3>
          <p className="text-xs text-base-content/60">
            Timeline view of income and volume for the chosen window.
          </p>
        </div>
        <div className="join bg-base-200 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setChartView("revenue")}
            className={`join-item btn btn-xs ${
              chartView === "revenue" ? "btn-main" : "btn-ghost"
            }`}
          >
            Revenue (৳)
          </button>
          <button
            onClick={() => setChartView("orders")}
            className={`join-item btn btn-xs ${
              chartView === "orders" ? "btn-main" : "btn-ghost"
            }`}
          >
            Order Count
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-72 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-main"></span>
        </div>
      ) : timelineData.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-base-content/60">
          <LuPackage className="size-12 opacity-30 mb-2" />
          <p className="text-sm font-medium">
            No order activity recorded in this date range.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "revenue" ? (
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => moment(val).format("MMM DD")}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) =>
                    `৳${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                  }
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Daily Revenue"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart
                data={timelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => moment(val).format("MMM DD")}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar
                  dataKey="orders"
                  name="Total Orders"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="delivered"
                  name="Delivered"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesTrendChart;

