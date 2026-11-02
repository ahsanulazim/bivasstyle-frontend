"use client";

import { getPublicCoupons } from "@/api/couponApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuCheck, LuCopy, LuTag } from "react-icons/lu";
import { toast } from "react-toastify";
import SettingsCard from "../settings/SettingsCard";

const AvailableCouponsCard = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["publicCoupons"],
    queryFn: getPublicCoupons,
    staleTime: 5 * 60 * 1000,
  });

  const coupons = data?.coupons || [];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (isLoading || coupons.length === 0) {
    return null; // Don't show clutter if no coupons are active
  }

  return (
    <SettingsCard title="Available Coupons" icon={LuTag}>
      <div className="space-y-2.5">
        {coupons.slice(0, 3).map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon._id}
              className="flex items-center justify-between p-2.5 bg-base-200/60 rounded-xl border border-base-300 border-dashed text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-mono font-bold text-main block truncate">
                  {coupon.code}
                </span>
                <span className="opacity-70 text-[11px] block truncate">
                  {coupon.description ||
                    (coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF on order`
                      : coupon.discountType === "fixed"
                        ? `৳${coupon.discountValue} OFF on order`
                        : "Free Shipping")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className={`btn btn-xs rounded-lg gap-1 shrink-0 ${
                  isCopied ? "btn-success text-white" : "btn-outline btn-main"
                }`}
              >
                {isCopied ? (
                  <>
                    <LuCheck className="size-3" /> Copied
                  </>
                ) : (
                  <>
                    <LuCopy className="size-3" /> Copy
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </SettingsCard>
  );
};

export default AvailableCouponsCard;
