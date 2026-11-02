"use client";

import TakaSymbol from "@/components/ui/TakaSymbol";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LuAlertCircle,
  LuArrowDownRight,
  LuArrowUpRight,
  LuFlame,
  LuPackageX,
  LuTag,
} from "react-icons/lu";

const ProductVelocityTabs = ({
  topSellingProducts = [],
  leastSellingProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState("top"); // "top" | "least"

  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Product Sales Velocity</h3>
            <span
              className={`badge badge-sm font-semibold gap-1 ${
                activeTab === "top"
                  ? "badge-primary badge-soft"
                  : "badge-warning badge-soft"
              }`}
            >
              {activeTab === "top" ? (
                <>
                  <LuFlame className="size-3 text-warning" /> High Demand
                </>
              ) : (
                <>
                  <LuPackageX className="size-3 text-error" /> Slow Movers /
                  Dead Stock
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-0.5">
            Identify your profit drivers vs capital tied up in slow-moving
            inventory.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="join bg-base-200 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("top")}
            className={`join-item btn btn-xs font-semibold ${
              activeTab === "top" ? "btn-main shadow-xs" : "btn-ghost"
            }`}
          >
            <LuArrowUpRight className="size-3.5" /> Top Selling
          </button>
          <button
            onClick={() => setActiveTab("least")}
            className={`join-item btn btn-xs font-semibold ${
              activeTab === "least" ? "btn-main shadow-xs" : "btn-ghost"
            }`}
          >
            <LuArrowDownRight className="size-3.5" /> Least Selling
          </button>
        </div>
      </div>

      {activeTab === "top" ? (
        /* Top Selling Table */
        topSellingProducts.length === 0 ? (
          <p className="text-xs opacity-60 py-10 text-center">
            No products sold in this period yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs uppercase text-base-content/60">
                  <th>Rank</th>
                  <th>Product</th>
                  <th className="text-center">Units Sold</th>
                  <th className="text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((prod, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-base-200/40 transition-colors"
                  >
                    <td className="font-bold text-xs">#{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle size-10 bg-base-200 relative overflow-hidden">
                            <Image
                              src={prod.image || "/assets/oiki-logo.svg"}
                              alt={prod.name}
                              width={40}
                              height={40}
                              className="object-cover size-10"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-xs line-clamp-1">
                            {prod.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-sm badge-success badge-soft font-bold">
                        {prod.quantity} pcs sold
                      </span>
                    </td>
                    <td className="text-right font-bold text-xs text-main">
                      <TakaSymbol />
                      {Number(prod.revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : /* Least Selling Table (Dead Stock Warning) */
      leastSellingProducts.length === 0 ? (
        <p className="text-xs opacity-60 py-10 text-center">
          No slow-moving inventory detected.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr className="text-xs uppercase text-base-content/60">
                <th>Product</th>
                <th>Category</th>
                <th className="text-center">Units Sold</th>
                <th className="text-center">Stock in Hand</th>
                <th className="text-right">Action Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {leastSellingProducts.map((prod, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-base-200/40 transition-colors"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle size-10 bg-base-200 relative overflow-hidden">
                          <Image
                            src={prod.image || "/assets/oiki-logo.svg"}
                            alt={prod.name}
                            width={40}
                            height={40}
                            className="object-cover size-10"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/products/edit-product?slug=${prod.slug}`}
                          className="font-semibold text-xs hover:text-main line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <span className="text-[11px] opacity-60">
                          <TakaSymbol />
                          {prod.price}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs capitalize opacity-75">
                    {prod.category?.replace(/-/g, " ") || "General"}
                  </td>
                  <td className="text-center">
                    <span className="badge badge-sm badge-neutral font-mono font-bold">
                      {prod.quantitySold || 0} sold
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-sm badge-warning badge-soft font-bold">
                      {prod.stock} left in stock
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/dashboard/coupons`}
                      className="btn btn-xs btn-outline btn-warning gap-1"
                      title="Offer discount on this item"
                    >
                      <LuTag className="size-3" /> Offer Discount
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductVelocityTabs;
