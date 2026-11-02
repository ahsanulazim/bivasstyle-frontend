"use client";

import Link from "next/link";
import { LuCircleCheck, LuTriangleAlert } from "react-icons/lu";

const InventoryAlertCard = ({ lowStockAlerts = [] }) => {
  return (
    <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LuTriangleAlert className="text-warning size-5" />
          <h3 className="font-bold text-lg">Inventory Warning</h3>
        </div>
        <p className="text-xs text-base-content/60 mb-3">
          Variants with 3 units or fewer remaining.
        </p>

        {lowStockAlerts.length === 0 ? (
          <div className="p-6 text-center text-xs opacity-60">
            <LuCircleCheck className="size-8 text-success mx-auto mb-2" />
            All inventory levels are healthy!
          </div>
        ) : (
          <ul className="divide-y divide-base-200 max-h-72 overflow-y-auto text-xs">
            {lowStockAlerts.map((item, idx) => (
              <li
                key={idx}
                className="py-2.5 flex items-center justify-between gap-2"
              >
                <div>
                  <Link
                    href={`/dashboard/products/edit-product?slug=${item.slug}`}
                    className="font-semibold hover:text-main line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <p className="opacity-60 text-[11px]">
                    {item.color ? `${item.color} • ` : ""}
                    {item.size ? `Size: ${item.size}` : ""}
                  </p>
                </div>
                <span
                  className={`badge badge-xs font-bold ${
                    item.stock <= 0 ? "badge-error" : "badge-warning"
                  }`}
                >
                  {item.stock <= 0 ? "Stock Out" : `${item.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-base-200">
        <Link
          href="/dashboard/products"
          className="btn btn-xs btn-outline btn-block text-xs"
        >
          Manage Inventory
        </Link>
      </div>
    </div>
  );
};

export default InventoryAlertCard;
