"use client";

import { getPublicCoupons, validateCouponCode } from "@/api/couponApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { LuCheck, LuSparkles, LuTag, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import TakaSymbol from "../ui/TakaSymbol";

const Overview = ({ isCheckout, ref, isPending, paymentMethod }) => {
  const {
    calculateTotalPrice,
    deliveryAdd,
    shippingPrice,
    cartItems,
    newUser,
    appliedCoupon,
    setAppliedCoupon,
    clearCoupon,
  } = useContext(MyContext);

  const [couponInput, setCouponInput] = useState("");

  const { data: publicCouponsData } = useQuery({
    queryKey: ["publicCoupons"],
    queryFn: getPublicCoupons,
  });

  const publicCoupons = (publicCouponsData?.coupons || []).filter(
    (c) => c.isPublic,
  );

  const subtotal = calculateTotalPrice();
  const baseShipping = deliveryAdd ? Number(shippingPrice?.baseCharge) || 0 : 0;

  const validateMutation = useMutation({
    mutationFn: validateCouponCode,
    onSuccess: (res) => {
      setAppliedCoupon({
        code: res.coupon.code,
        title: res.coupon.title,
        discountType: res.coupon.discountType,
        discountValue: res.coupon.discountValue,
        discountAmount: res.discountAmount,
        freeShipping: res.freeShipping,
      });
      setCouponInput("");
      toast.success(res.message || "Coupon applied!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    },
  });

  // Re-evaluate free_shipping discount amount when deliveryAdd/baseShipping changes
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.discountType === "free_shipping") {
      setAppliedCoupon((prev) =>
        prev ? { ...prev, discountAmount: baseShipping } : null,
      );
    }
  }, [baseShipping, appliedCoupon?.discountType, setAppliedCoupon]);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply ?? couponInput).trim().toUpperCase();
    if (!code) {
      return toast.warning("Please enter a coupon code");
    }
    validateMutation.mutate({
      code,
      cartItems,
      userId: newUser?.user?._id || "guest",
      email: newUser?.user?.email || "",
      phone: newUser?.user?.phone || "",
      shippingCharge: baseShipping,
    });
  };

  const discountAmount = appliedCoupon
    ? Number(appliedCoupon.discountAmount) || 0
    : 0;
  const grandTotal = Math.max(subtotal + baseShipping - discountAmount, 0);

  return (
    <div className="bg-base-100 rounded-box p-5 space-y-4">
      <h2 className="font-bold text-xl">Order Summary</h2>
      <div className="divider my-0"></div>

      {/* Promo Code Input Section */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase opacity-70 flex items-center gap-1.5">
          <LuTag className="text-main" /> Promo / Coupon Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs">
            <div className="flex items-center gap-2">
              <LuCheck className="text-success size-4 shrink-0" />
              <div>
                <p className="font-mono font-bold text-success">
                  {appliedCoupon.code}
                </p>
                <p className="opacity-75 text-[11px]">
                  {appliedCoupon.freeShipping
                    ? "Free Shipping Applied"
                    : `Saved ৳${discountAmount}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearCoupon}
              className="btn btn-xs btn-ghost btn-circle text-error"
              title="Remove coupon"
            >
              <LuX />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Enter promo code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                className="input input-sm input-bordered flex-1 font-mono uppercase text-xs"
              />
              <button
                type="button"
                disabled={validateMutation.isPending || !couponInput.trim()}
                onClick={() => handleApplyCoupon()}
                className="btn btn-sm btn-main"
              >
                {validateMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {/* Public Available Promo Chips */}
            {publicCoupons.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] opacity-60 mb-1.5 flex items-center gap-1">
                  <LuSparkles className="text-warning size-3" /> Available
                  Offers (Click to apply):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {publicCoupons.slice(0, 3).map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="badge badge-sm badge-outline border-dashed border-main text-main hover:bg-main hover:text-white cursor-pointer py-2.5 px-2 font-mono text-[11px] transition-colors"
                      title={c.description || c.title}
                    >
                      {c.code} &bull;{" "}
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : c.discountType === "fixed"
                          ? `৳${c.discountValue} OFF`
                          : "FREE SHIP"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="divider my-0"></div>

      {/* Price Breakdown */}
      <div className="flex flex-col space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="opacity-75">Subtotal:</span>
          <span className="font-bold">
            <TakaSymbol /> {subtotal}
          </span>
        </div>

        {deliveryAdd && (
          <div className="flex justify-between">
            <span className="opacity-75">Shipping:</span>
            <span className="font-bold">
              {appliedCoupon?.freeShipping ? (
                <span className="text-success font-bold">
                  <span className="line-through opacity-50 mr-1">
                    ৳{baseShipping}
                  </span>
                  FREE
                </span>
              ) : (
                <>
                  <TakaSymbol /> {baseShipping}
                </>
              )}
            </span>
          </div>
        )}

        {appliedCoupon && discountAmount > 0 && !appliedCoupon.freeShipping && (
          <div className="flex justify-between text-success font-medium">
            <span>Discount ({appliedCoupon.code}):</span>
            <span>
              -<TakaSymbol /> {discountAmount}
            </span>
          </div>
        )}

        <div className="divider my-0"></div>

        <div className="flex justify-between items-center pt-1">
          <span className="font-bold text-base">Total:</span>
          <span className="font-bold text-xl text-main">
            <TakaSymbol /> {grandTotal}
          </span>
        </div>
      </div>

      {isCheckout && (
        <label className="label items-start gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-sm mt-0.5"
          />
          <span className="text-wrap text-xs leading-relaxed">
            I have read and agree to the{" "}
            <Link href="/shipping-policy" className="link link-hover text-main">
              Shipping Terms
            </Link>
            ,{" "}
            <Link href="/privacy-policy" className="link link-hover text-main">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/return-policy" className="link link-hover text-main">
              Return & Exchange Policy
            </Link>
            .
          </span>
        </label>
      )}

      {isCheckout ? (
        <button
          onClick={() => ref.current.requestSubmit()}
          disabled={isPending}
          className={`btn ${isPending ? "" : "btn-main"} w-full`}
        >
          {isPending && <span className="loading loading-spinner"></span>}
          {paymentMethod === "cod" ? "Confirm Order" : "Pay Now"}
        </button>
      ) : (
        <Link href="/cart/checkout">
          <button className="btn btn-main w-full">Proceed to Checkout</button>
        </Link>
      )}
    </div>
  );
};

export default Overview;
