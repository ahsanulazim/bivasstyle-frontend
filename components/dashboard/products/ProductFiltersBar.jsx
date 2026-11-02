"use client";

import { LuRotateCcw, LuSearch, LuSlidersHorizontal } from "react-icons/lu";

const ProductFiltersBar = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  categories = [],
  onReset,
}) => {
  return (
    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs mb-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <label className="input input-sm rounded-xl w-full flex items-center gap-2 bg-base-200/50">
            <LuSearch className="size-4 opacity-50 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, SKU, or barcode..."
              className="grow text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            )}
          </label>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-sm rounded-xl text-xs bg-base-200/50"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Status */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="select select-sm rounded-xl text-xs bg-base-200/50"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock (&gt; 5)</option>
            <option value="low">Low Stock (1 - 5)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Publication Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-sm rounded-xl text-xs bg-base-200/50"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select select-sm rounded-xl text-xs bg-base-200/50"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>

          {/* Reset button */}
          {(searchQuery ||
            categoryFilter !== "all" ||
            stockFilter !== "all" ||
            statusFilter !== "all" ||
            sortOption !== "newest") && (
            <button
              onClick={onReset}
              className="btn btn-sm btn-ghost gap-1 text-xs"
              title="Reset all filters"
            >
              <LuRotateCcw className="size-3" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFiltersBar;

