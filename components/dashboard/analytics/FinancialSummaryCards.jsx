"use client";

import TakaSymbol from "@/components/ui/TakaSymbol";
import Link from "next/link";
import { LuReceipt, LuTag } from "react-icons/lu";

const FinancialSummaryCards = ({
  kpis = {},
  couponUsage = [],
}) => {
  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
        <LuReceipt className="text-secondary" /> Financial Breakdown & Discounts
      </h3>
      <p className="text-xs text-base-content/60 mb-4">
        Overview of shipping charges collected, discount concessions, and coupon redemption.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/50">
          <span className="text-xs font-semibold text-base-content/60">
            Total Shipping Fees Collected
          </span>
          <h4 className="text-xl font-bold mt-1 text-info">
            <TakaSymbol />
            {Number(kpis.totalShippingCollected || 0).toLocaleString()}
          </h4>
          <p className="text-[11px] opacity-60 mt-1">
            From {kpis.validOrders || 0} fulfilled/valid orders
          </p>
        </div>

        <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/50">
          <span className="text-xs font-semibold text-base-content/60">
            Discounts / Promotional Expense
          </span>
          <h4 className="text-xl font-bold mt-1 text-error">
            <TakaSymbol />
            {Number(kpis.totalDiscountGiven || 0).toLocaleString()}
          </h4>
          <p className="text-[11px] opacity-60 mt-1">
            Savings granted to customers via promo codes
          </p>
        </div>

        <div className="p-4 rounded-xl bg-base-200/50 border border-base-300/50">
          <span className="text-xs font-semibold text-base-content/60">
            Active Promo Campaigns
          </span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {couponUsage.length === 0 ? (
              <span className="text-xs opacity-60">No coupons redeemed yet</span>
            ) : (
              couponUsage.map((c, i) => (
                <span
                  key={i}
                  className="badge badge-sm badge-neutral gap-1 font-mono text-[11px]"
                >
                  <LuTag className="size-2.5" />
                  {c.code} ({c.usedCount}x)
                </span>
              ))
            )}
          </div>
          <p className="text-[11px] opacity-60 mt-2">
            <Link href="/dashboard/coupons" className="link text-main">
              Manage all coupons &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCards;

