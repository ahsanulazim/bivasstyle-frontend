"use client";

import TakaSymbol from "@/components/ui/TakaSymbol";
import {
  LuBoxes,
  LuCircleCheck,
  LuCoins,
  LuPackageX,
  LuTriangleAlert,
} from "react-icons/lu";

const ProductInventoryStats = ({ products = [] }) => {
  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalInventoryValue = 0;

  products.forEach((p) => {
    let stock = 0;
    if (Array.isArray(p.variantDetails) && p.variantDetails.length > 0) {
      stock = p.variantDetails.reduce((sum, v) => {
        if (Array.isArray(v.sizes) && v.sizes.length > 0) {
          return (
            sum +
            v.sizes.reduce((sSum, s) => sSum + Number(s.stock || 0), 0)
          );
        }
        return sum + Number(v.stock || 0);
      }, 0);
    } else {
      stock = Number(p.stock || 0);
    }

    const price = Number(p.discount || p.price || 0);
    totalInventoryValue += stock * price;

    const threshold = Number(p.lowStockThreshold || 5);
    if (stock <= 0) {
      outOfStockCount += 1;
    } else if (stock <= threshold) {
      lowStockCount += 1;
    } else {
      inStockCount += 1;
    }
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
      {/* Total Products */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
            Total Products
          </span>
          <h3 className="text-xl font-bold mt-1">{products.length}</h3>
        </div>
        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <LuBoxes className="size-4" />
        </div>
      </div>

      {/* In Stock */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
            In Stock
          </span>
          <h3 className="text-xl font-bold mt-1 text-success">
            {inStockCount}
          </h3>
        </div>
        <div className="size-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
          <LuCircleCheck className="size-4" />
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
            Low Stock Alerts
          </span>
          <h3 className="text-xl font-bold mt-1 text-warning">
            {lowStockCount}
          </h3>
        </div>
        <div className="size-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
          <LuTriangleAlert className="size-4" />
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
            Out of Stock
          </span>
          <h3 className="text-xl font-bold mt-1 text-error">
            {outOfStockCount}
          </h3>
        </div>
        <div className="size-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
          <LuPackageX className="size-4" />
        </div>
      </div>

      {/* Inventory Valuation */}
      <div className="col-span-2 lg:col-span-1 bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
            Stock Asset Value
          </span>
          <h3 className="text-xl font-bold mt-1 text-main">
            <TakaSymbol />
            {totalInventoryValue.toLocaleString()}
          </h3>
        </div>
        <div className="size-9 rounded-xl bg-main/10 text-main flex items-center justify-center">
          <LuCoins className="size-4" />
        </div>
      </div>
    </div>
  );
};

export default ProductInventoryStats;
