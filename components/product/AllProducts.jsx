"use client";
import { getProductsByFilters } from "@/api/productApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../ui/ProductCard";
import ProductCardSkeleton from "../ui/skeleton/ProductCardSkeleton";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";

const AllProducts = ({ category }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sizes = searchParams.get("sizes");
  const colors = searchParams.get("colors");
  const stock = searchParams.get("stock");
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");

  const filters = {
    minPrice,
    maxPrice,
    sizes,
    colors,
    stock,
    sort,
    search,
  };

  const isAll = !category || category === "all";
  const basePath = isAll ? "/products" : `/products/${category}`;

  const {
    data: productsData,
    isLoading: productsLoading,
    isError,
  } = useQuery({
    queryKey: ["products", page, category, filters],
    queryFn: () => getProductsByFilters(category, page, 12, filters),
  });

  const goToPage = (pageNum) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", pageNum);
    router.push(`${basePath}?${query.toString()}`);
  };

  const clearSearch = () => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete("search");
    query.set("page", "1");
    router.push(`${basePath}?${query.toString()}`);
  };

  const totalPages = productsData?.totalPages || 0;
  const products = productsData?.products || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Active Search Banner */}
      {search && (
        <div className="flex items-center justify-between bg-base-200/60 border border-base-300 rounded-box px-4 py-2 mt-3">
          <div className="text-sm">
            Showing results for: <span className="font-semibold text-main">"{search}"</span>
            {productsData?.totalProducts !== undefined && (
              <span className="opacity-70 ml-2">({productsData.totalProducts} found)</span>
            )}
          </div>
          <button
            onClick={clearSearch}
            className="btn btn-ghost btn-xs btn-circle"
            title="Clear search"
          >
            <LuX />
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 mt-2">
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="col-span-full py-16 text-center text-error">
            <p className="font-semibold text-lg">Unable to load products.</p>
            <p className="text-sm opacity-70 mt-1">Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <h3 className="font-bold text-xl text-base-content/80">No products found</h3>
            <p className="text-sm opacity-60 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your selected filters. Try resetting your filters.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center my-6">
          <div className="join border border-base-300">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="join-item btn btn-sm"
              aria-label="Previous Page"
            >
              <LuArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`join-item btn btn-sm ${
                  num === page ? "btn-main" : ""
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="join-item btn btn-sm"
              aria-label="Next Page"
            >
              <LuArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
