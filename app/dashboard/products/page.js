"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductData from "@/components/dashboard/products/ProductData";
import ReviewsModerationModal from "@/components/dashboard/products/ReviewsModerationModal";
import Link from "next/link";
import { useState } from "react";
import { LuMessageSquare, LuPlus } from "react-icons/lu";

const ProductsPage = () => {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <Breadcrumbs title="Products" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products & Inventory</h1>
          <p className="text-xs text-base-content/65 mt-1">
            Manage your store catalog, track stock levels, calculate profit margins, and moderate reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsReviewsModalOpen(true)}
            className="btn btn-sm btn-outline gap-1.5 text-xs font-semibold"
          >
            <LuMessageSquare className="size-3.5" /> Customer Reviews
          </button>
          <Link
            href="/dashboard/products/add-product"
            className="btn btn-sm btn-main gap-1 text-xs font-semibold"
          >
            <LuPlus className="size-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Main Products Inventory Table & Tools */}
      <ProductData />

      {/* Reviews Moderation Modal */}
      <ReviewsModerationModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
      />
    </div>
  );
};

export default ProductsPage;
