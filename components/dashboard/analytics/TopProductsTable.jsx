"use client";

import TakaSymbol from "@/components/ui/TakaSymbol";
import Image from "next/image";
import Link from "next/link";

const TopProductsTable = ({ topSellingProducts = [] }) => {
  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">Top-Selling Products</h3>
          <p className="text-xs text-base-content/60">
            Products driving the highest sales volume and revenue.
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-xs font-semibold text-main hover:underline"
        >
          All Products &rarr;
        </Link>
      </div>

      {topSellingProducts.length === 0 ? (
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
                    <span className="badge badge-sm badge-ghost font-bold">
                      {prod.quantity} pcs
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
      )}
    </div>
  );
};

export default TopProductsTable;

