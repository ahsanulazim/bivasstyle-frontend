"use client";

import {
  bulkUpdateProducts,
  deleteProduct,
  toggleProductFeatured,
} from "@/api/productApi";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo, useRef, useState } from "react";
import {
  LuBoxes,
  LuExternalLink,
  LuMessageSquare,
  LuPlus,
  LuSquarePen,
  LuStar,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";
import ProductBulkActionBar from "./ProductBulkActionBar";
import ProductDeleteModal from "./ProductDeleteModal";
import ProductFiltersBar from "./ProductFiltersBar";
import ProductInventoryStats from "./ProductInventoryStats";
import QuickStockModal from "./QuickStockModal";
import ReviewsModerationModal from "./ReviewsModerationModal";

const ProductData = () => {
  const queryClient = useQueryClient();
  const deleteModalRef = useRef();
  const { products = [], productsLoading, categories = [] } =
    useContext(MyContext);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Selection & Modals State
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [activeDeleteId, setActiveDeleteId] = useState(null);
  const [quickStockProduct, setQuickStockProduct] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Helper to compute total stock
  const getTotalStock = (product) => {
    if (
      Array.isArray(product.variantDetails) &&
      product.variantDetails.length > 0
    ) {
      return product.variantDetails.reduce((total, variant) => {
        if (Array.isArray(variant.sizes) && variant.sizes.length > 0) {
          const variantStock = variant.sizes.reduce(
            (sum, s) => sum + Number(s.stock || 0),
            0,
          );
          return total + variantStock;
        }
        return total + Number(variant.stock || 0);
      }, 0);
    }
    return Number(product.stock || 0);
  };

  // Toggle Featured Mutation
  const featuredMutation = useMutation({
    mutationFn: toggleProductFeatured,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(res.message || "Featured status updated");
    },
    onError: () => toast.error("Failed to toggle featured status"),
  });

  // Bulk Operations Mutation
  const bulkMutation = useMutation({
    mutationFn: bulkUpdateProducts,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProductIds([]);
      toast.success(res.message || "Bulk operation completed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed bulk operation");
    },
  });

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.productName || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.barcode || "").toLowerCase().includes(q),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Publication Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (p) => (p.status || "published").toLowerCase() === statusFilter,
      );
    }

    // Stock Status filter
    if (stockFilter !== "all") {
      result = result.filter((p) => {
        const stock = getTotalStock(p);
        const threshold = Number(p.lowStockThreshold || 5);
        if (stockFilter === "out") return stock <= 0;
        if (stockFilter === "low") return stock > 0 && stock <= threshold;
        if (stockFilter === "in") return stock > threshold;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "price-asc") {
        return Number(a.price || 0) - Number(b.price || 0);
      }
      if (sortOption === "price-desc") {
        return Number(b.price || 0) - Number(a.price || 0);
      }
      if (sortOption === "stock-asc") {
        return getTotalStock(a) - getTotalStock(b);
      }
      if (sortOption === "stock-desc") {
        return getTotalStock(b) - getTotalStock(a);
      }
      // Default: Newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [
    products,
    searchQuery,
    categoryFilter,
    statusFilter,
    stockFilter,
    sortOption,
  ]);

  // Bulk Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map((p) => p._id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkStatusChange = (status) => {
    bulkMutation.mutate({
      action: "status",
      ids: selectedProductIds,
      payload: { status },
    });
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `Are you sure you want to permanently delete ${selectedProductIds.length} selected products?`,
      )
    ) {
      bulkMutation.mutate({
        action: "delete",
        ids: selectedProductIds,
      });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
    setStatusFilter("all");
    setSortOption("newest");
  };

  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p._id));

  return (
    <div>
      {/* 1. Inventory Summary Cards */}
      <ProductInventoryStats products={products} />

      {/* 2. Search & Filters Bar */}
      <ProductFiltersBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* 3. Bulk Action Bar (Visible when items selected) */}
      <ProductBulkActionBar
        selectedCount={selectedProductIds.length}
        onClearSelection={() => setSelectedProductIds([])}
        onBulkStatus={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        isPending={bulkMutation.isPending}
      />

      {/* 4. Products Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-xs">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-200/60 text-xs uppercase tracking-wider text-base-content/70">
              <th className="w-10">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs rounded-sm"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Product Details</th>
              <th>SKU / Barcode</th>
              <th>Pricing & Profit</th>
              <th>Category</th>
              <th className="text-center">Featured</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsLoading ? (
              <tr>
                <td colSpan="9" className="text-center py-10">
                  <span className="loading loading-spinner text-main" />
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-12 text-xs opacity-60"
                >
                  No products found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const totalStock = getTotalStock(product);
                const isSelected = selectedProductIds.includes(product._id);
                const sellingPrice = Number(product.discount || product.price || 0);
                const costPrice = Number(product.costPrice || 0);
                const profitMargin =
                  costPrice > 0 && sellingPrice > costPrice
                    ? Math.round(
                        ((sellingPrice - costPrice) / sellingPrice) * 100,
                      )
                    : null;
                const status = (product.status || "published").toLowerCase();

                return (
                  <tr
                    key={product._id || product.slug}
                    className={`hover:bg-base-200/40 transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs rounded-sm"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(product._id)}
                      />
                    </td>

                    {/* Product Name & Thumbnail */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle size-11 bg-base-200 relative overflow-hidden">
                            <Image
                              src={
                                product.productImages?.[0] ||
                                product.variantDetails?.[0]?.swatchImage ||
                                "/assets/logo.svg"
                              }
                              alt={product.productName}
                              width={44}
                              height={44}
                              className="object-cover size-11"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/products/edit-product?slug=${product.slug}`}
                            className="font-bold text-xs hover:text-main line-clamp-1 flex items-center gap-1"
                          >
                            {product.productName}
                          </Link>
                          <span className="text-[11px] opacity-60">
                            {product.variantDetails?.length || 0} variant(s)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU & Barcode */}
                    <td className="text-xs font-mono">
                      <div>{product.sku || "N/A"}</div>
                      {product.barcode && (
                        <div className="text-[10px] opacity-60">
                          {product.barcode}
                        </div>
                      )}
                    </td>

                    {/* Pricing & Profit */}
                    <td>
                      <div className="text-xs font-bold text-base-content">
                        <TakaSymbol />
                        {product.price}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-[10px] text-error line-through">
                          <TakaSymbol />
                          {product.price} (Now: ৳{product.discount})
                        </div>
                      )}
                      {costPrice > 0 && (
                        <div className="text-[10px] text-base-content/60 flex items-center gap-1 mt-0.5">
                          <span>Cost: ৳{costPrice}</span>
                          {profitMargin && (
                            <span className="badge badge-[10px] badge-success badge-soft font-bold">
                              +{profitMargin}%
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="capitalize text-xs opacity-80">
                      {product.category?.replace(/-/g, " ")}
                    </td>

                    {/* Featured Toggle Button */}
                    <td className="text-center">
                      <button
                        onClick={() => featuredMutation.mutate(product._id)}
                        disabled={featuredMutation.isPending}
                        className={`btn btn-circle btn-xs transition-transform ${
                          product.featured
                            ? "btn-warning text-warning-content shadow-xs"
                            : "btn-ghost opacity-40 hover:opacity-100"
                        }`}
                        title={
                          product.featured
                            ? "Featured on Homepage (Click to disable)"
                            : "Not featured (Click to feature)"
                        }
                      >
                        <LuStar
                          className={`size-3.5 ${
                            product.featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </td>

                    {/* Stock Level with Quick Stock adjustment */}
                    <td>
                      <button
                        onClick={() => setQuickStockProduct(product)}
                        className={`badge badge-sm font-bold gap-1 cursor-pointer hover:opacity-80 transition-all ${
                          totalStock <= 0
                            ? "badge-error"
                            : totalStock <=
                                Number(product.lowStockThreshold || 5)
                              ? "badge-warning"
                              : "badge-success badge-soft"
                        }`}
                        title="Click to adjust stock quickly"
                      >
                        <LuBoxes className="size-3" />
                        {totalStock <= 0 ? "Out of Stock" : `${totalStock} pcs`}
                      </button>
                    </td>

                    {/* Publication Status */}
                    <td>
                      <span
                        className={`badge badge-xs uppercase font-bold ${
                          status === "published"
                            ? "badge-success"
                            : status === "draft"
                              ? "badge-warning"
                              : "badge-neutral"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/products/edit-product?slug=${product.slug}`}
                          className="btn btn-ghost btn-xs btn-circle text-info"
                          title="Edit Full Product"
                        >
                          <LuSquarePen className="size-3.5" />
                        </Link>
                        <button
                          className="btn btn-ghost btn-xs btn-circle text-error"
                          onClick={() => {
                            setActiveDeleteId(product._id);
                            deleteModalRef.current?.showModal();
                          }}
                          title="Delete Product"
                        >
                          <LuTrash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal ref={deleteModalRef} id={activeDeleteId} />

      {/* Quick Stock Adjustment Modal */}
      <QuickStockModal
        product={quickStockProduct}
        isOpen={Boolean(quickStockProduct)}
        onClose={() => setQuickStockProduct(null)}
      />

      {/* Customer Reviews Moderation Modal */}
      <ReviewsModerationModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
      />
    </div>
  );
};

export default ProductData;
