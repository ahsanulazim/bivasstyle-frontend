"use client";

import TakaSymbol from "@/components/ui/TakaSymbol";
import {
  LuArrowUpRight,
  LuPercent,
  LuReceipt,
  LuRepeat,
  LuShoppingBag,
  LuTruck,
  LuUserCheck,
  LuWallet,
} from "react-icons/lu";

const KpiCardsGrid = ({ kpis = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Revenue */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Net Revenue
          </span>
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <LuWallet className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight">
            <TakaSymbol />
            {Number(kpis.totalRevenue || 0).toLocaleString()}
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <span className="badge badge-xs badge-success badge-soft font-semibold gap-0.5">
              <LuArrowUpRight className="size-3" />
              {kpis.validOrders || 0} valid
            </span>
            <span className="text-base-content/60">excluding cancelled</span>
          </div>
        </div>
      </div>

      {/* 2. Total Orders */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Total Orders
          </span>
          <div className="size-9 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <LuShoppingBag className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {Number(kpis.totalOrders || 0).toLocaleString()}
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <span className="badge badge-xs badge-warning badge-soft font-semibold">
              {kpis.pendingOrders || 0} pending
            </span>
            <span className="badge badge-xs badge-info badge-soft font-semibold">
              {kpis.processingOrders || 0} prep
            </span>
          </div>
        </div>
      </div>

      {/* 3. Average Order Value (AOV) */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Avg Order Value (AOV)
          </span>
          <div className="size-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <LuReceipt className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight">
            <TakaSymbol />
            {Number(kpis.averageOrderValue || 0).toLocaleString()}
          </h2>
          <p className="mt-2 text-[11px] text-base-content/60 line-clamp-1">
            Avg spend per valid checkout
          </p>
        </div>
      </div>

      {/* 4. Order Conversion & Delivery Rate */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Order Conversion Rate
          </span>
          <div className="size-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <LuTruck className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-success">
            {kpis.deliverySuccessRate || 0}%
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <span className="badge badge-xs badge-success badge-soft font-semibold">
              {kpis.deliveredOrders || 0} delivered
            </span>
            {Number(kpis.returnOrCancelRate || 0) > 0 && (
              <span className="badge badge-xs badge-error badge-soft font-semibold">
                {kpis.returnOrCancelRate}% cancel
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Repeat Customer Rate */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Repeat Buyer Rate
          </span>
          <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <LuRepeat className="size-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
            {kpis.repeatCustomerRate || 0}%
          </h2>
          <p className="mt-2 text-[11px] text-base-content/60 line-clamp-1">
            {kpis.repeatCustomersCount || 0} of {kpis.uniqueCustomersCount || 0} returning buyers
          </p>
        </div>
      </div>
    </div>
  );
};

export default KpiCardsGrid;
