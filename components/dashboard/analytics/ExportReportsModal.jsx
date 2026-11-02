"use client";

import { downloadAnalyticsReport } from "@/api/analyticsApi";
import { useState } from "react";
import {
  LuBox,
  LuDownload,
  LuFileSpreadsheet,
  LuReceipt,
  LuShoppingBag,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const REPORT_TYPES = [
  {
    id: "sales",
    title: "Sales & Financial Summary",
    description:
      "Daily aggregation of gross sales, shipping collected, promo discount expenses, and net revenue.",
    icon: LuReceipt,
    badge: "Financial Audit",
  },
  {
    id: "orders",
    title: "Order History & Logistics Report",
    description:
      "Detailed line-item orders with customer contact, shipping addresses, fulfillment status, and Steadfast courier tracking codes.",
    icon: LuShoppingBag,
    badge: "Operations & COD",
  },
  {
    id: "products",
    title: "Product Performance & Stock Valuation",
    description:
      "Product-wise velocity: units sold in selected period, revenue generated, and remaining warehouse inventory.",
    icon: LuBox,
    badge: "Inventory & Merchandising",
  },
];

const ExportReportsModal = ({ isOpen, onClose, selectedRange = "30d" }) => {
  const [downloadingType, setDownloadingType] = useState(null);

  if (!isOpen) return null;

  const handleDownload = async (type) => {
    try {
      setDownloadingType(type);
      const blob = await downloadAnalyticsReport(type, selectedRange);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}_report_${selectedRange}_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate report export",
      );
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl p-6 rounded-3xl border border-base-300 bg-base-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <LuX className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <LuFileSpreadsheet className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Export Business Reports</h3>
            <p className="text-xs text-base-content/60">
              Download structured spreadsheet datasets for the selected time window (
              <span className="font-semibold text-main uppercase">
                {selectedRange}
              </span>
              ).
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-5">
          {REPORT_TYPES.map((rep) => {
            const Icon = rep.icon;
            const isCurrentDownloading = downloadingType === rep.id;

            return (
              <div
                key={rep.id}
                className="p-4 rounded-2xl border border-base-300 hover:border-primary/50 bg-base-200/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-base-100 text-main flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-base-content">
                        {rep.title}
                      </h4>
                      <span className="badge badge-xs badge-neutral font-medium">
                        {rep.badge}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/65 mt-0.5 leading-relaxed">
                      {rep.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rep.id)}
                  disabled={downloadingType !== null}
                  className="btn btn-sm btn-main gap-1.5 self-end sm:self-auto shrink-0"
                >
                  {isCurrentDownloading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <LuDownload className="size-3.5" />
                  )}
                  Export CSV
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-action mt-6 pt-3 border-t border-base-200">
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-xs" onClick={onClose} />
    </div>
  );
};

export default ExportReportsModal;

