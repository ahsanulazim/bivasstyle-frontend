"use client";

import { useState } from "react";
import { LuDownload, LuFileSpreadsheet, LuRefreshCw } from "react-icons/lu";
import ExportReportsModal from "./ExportReportsModal";

export const RANGE_OPTIONS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "90 Days", value: "90d" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

const AnalyticsHeader = ({
  selectedRange,
  setSelectedRange,
  isFetching,
  onRefresh,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Store Analytics</h1>
            <span className="badge badge-primary badge-soft text-xs font-semibold">
              Live Insights
            </span>
          </div>
          <p className="text-xs text-base-content/65 mt-1">
            Track revenue trends, order conversion funnel, product velocity, and operational health.
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="join bg-base-200/80 p-1 rounded-xl">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedRange(opt.value)}
                className={`join-item btn btn-xs border-0 rounded-lg font-medium transition-all ${
                  selectedRange === opt.value
                    ? "btn-main shadow-xs"
                    : "btn-ghost text-base-content/70 hover:bg-base-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="btn btn-sm btn-ghost btn-circle"
            title="Refresh Data"
          >
            <LuRefreshCw
              className={`size-4 ${isFetching ? "animate-spin text-main" : ""}`}
            />
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="btn btn-sm btn-outline gap-1.5 text-xs font-semibold"
          >
            <LuFileSpreadsheet className="size-3.5" /> Export Reports
          </button>
        </div>
      </div>

      <ExportReportsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedRange={selectedRange}
      />
    </>
  );
};

export default AnalyticsHeader;
