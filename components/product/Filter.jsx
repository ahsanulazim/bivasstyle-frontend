"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CategoryNav from "./CategoryNav";
import TakaSymbol from "../ui/TakaSymbol";
import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "@/api/productApi";
import AllProducts from "./AllProducts";
import { useRouter, useSearchParams } from "next/navigation";
import { LuRotateCcw } from "react-icons/lu";

const Range = dynamic(() => import("react-range").then((mod) => mod.Range), {
  ssr: false,
});

const Filter = ({ category }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAll = !category || category === "all";
  const basePath = isAll ? "/products" : `/products/${category}`;

  const {
    data: filters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["filters", category],
    queryFn: () => fetchFilters(category),
  });

  const categoryMax = Math.max(Number(filters?.maxPrice || 0), 0);
  const maxPriceLimit = categoryMax > 0 ? categoryMax : 10000;

  const [price, setPrice] = useState([0, maxPriceLimit]);

  useEffect(() => {
    const minParam = searchParams.get("minPrice");
    const maxParam = searchParams.get("maxPrice");

    const currentMin =
      minParam !== null && minParam !== "" ? Math.max(0, Number(minParam)) : 0;
    const currentMax =
      maxParam !== null && maxParam !== ""
        ? Math.min(maxPriceLimit, Math.max(currentMin, Number(maxParam)))
        : maxPriceLimit;

    setPrice([currentMin, currentMax]);
  }, [filters, searchParams, maxPriceLimit]);

  // Update price in query string
  const updatePriceQuery = (minVal, maxVal) => {
    const query = new URLSearchParams(searchParams.toString());
    if (minVal > 0) {
      query.set("minPrice", minVal);
    } else {
      query.delete("minPrice");
    }
    if (maxVal < maxPriceLimit) {
      query.set("maxPrice", maxVal);
    } else {
      query.delete("maxPrice");
    }
    query.set("page", "1");
    router.push(`${basePath}?${query.toString()}`);
  };

  // Update query string
  const updateQuery = (key, value) => {
    const query = new URLSearchParams(searchParams.toString());
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    } else {
      query.delete(key);
    }
    query.set("page", "1");
    router.push(`${basePath}?${query.toString()}`);
  };

  const hasActiveFilters =
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("sizes") ||
    searchParams.has("colors") ||
    searchParams.has("stock") ||
    searchParams.has("search");

  const clearAllFilters = () => {
    router.push(basePath);
  };

  return (
    <section className="px-5">
      <div className="max-w-360 mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="col-span-1">
            <div className="drawer lg:drawer-open lg:auto-cols-auto">
              <input
                id="my-drawer-3"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content col-start-1 flex flex-col items-center justify-center"></div>
              <div className="drawer-side h-auto max-lg:z-40">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <div className="bg-base-100 w-80 min-h-full lg:min-h-auto lg:w-full p-4 shadow-sm lg:rounded-box">
                  {/* Reset Filters */}
                  {hasActiveFilters && (
                    <div className="mb-4">
                      <button
                        onClick={clearAllFilters}
                        className="btn btn-sm btn-outline btn-error w-full gap-2"
                      >
                        <LuRotateCcw /> Reset Filters
                      </button>
                    </div>
                  )}

                  {/* Price Filter */}
                  <div>
                    <h4 className="text-lg font-bold">Price</h4>
                    <div className="divider mt-0"></div>
                    <div>
                      {isLoading ? (
                        <div className="h-4 bg-base-300 animate-pulse rounded-full w-full my-3" />
                      ) : (
                        <Range
                          step={
                            maxPriceLimit % 50 === 0
                              ? 50
                              : maxPriceLimit % 10 === 0
                              ? 10
                              : 1
                          }
                          min={0}
                          max={maxPriceLimit}
                          values={price}
                          onChange={(values) => {
                            setPrice(values);
                          }}
                          onFinalChange={(values) => {
                            updatePriceQuery(values[0], values[1]);
                          }}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              className="h-[6px] bg-neutral rounded-full w-full"
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              key={props.key}
                              className="size-5 rounded-full bg-main"
                            />
                          )}
                        />
                      )}
                      <div className="flex items-center justify-between mt-5 gap-10">
                        <span>
                          <TakaSymbol />
                          {price[0]}
                        </span>
                        <span>
                          <TakaSymbol />
                          {price[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Availability */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold">Availability</h4>
                    <div className="divider mt-0"></div>
                    <div className="fieldset flex flex-col gap-2">
                      <label className="label text-base-content cursor-pointer gap-2 justify-start">
                        <input
                          type="radio"
                          name="stock"
                          className="radio radio-sm"
                          checked={searchParams.get("stock") === "in"}
                          onChange={() => updateQuery("stock", "in")}
                        />
                        In Stock
                      </label>
                      <label className="label text-base-content cursor-pointer gap-2 justify-start">
                        <input
                          type="radio"
                          name="stock"
                          className="radio radio-sm"
                          checked={searchParams.get("stock") === "out"}
                          onChange={() => updateQuery("stock", "out")}
                        />
                        Out of Stock
                      </label>
                    </div>
                  </div>

                  {/* Sizes */}
                  {filters?.sizes?.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-bold">Size</h4>
                      <div className="divider mt-0"></div>
                      <div className="fieldset flex flex-wrap gap-2">
                        {filters.sizes.map((size) => {
                          const isSelected = (
                            searchParams.get("sizes")?.split(",") || []
                          ).includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                const current =
                                  searchParams.get("sizes")?.split(",").filter(Boolean) || [];
                                const updated = isSelected
                                  ? current.filter((s) => s !== size)
                                  : [...current, size];
                                updateQuery("sizes", updated.join(","));
                              }}
                              className={`btn btn-sm ${
                                isSelected ? "btn-main" : "btn-outline"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {filters?.colors?.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-bold">Color</h4>
                      <div className="divider mt-0"></div>
                      <div className="fieldset flex flex-col gap-2">
                        {filters.colors.map((color, i) => {
                          const isSelected = (
                            searchParams.get("colors")?.split(",") || []
                          ).includes(color.color);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const current =
                                  searchParams.get("colors")?.split(",").filter(Boolean) || [];
                                const updated = isSelected
                                  ? current.filter((col) => col !== color.color)
                                  : [...current, color.color];
                                updateQuery("colors", updated.join(","));
                              }}
                              className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition-all ${
                                isSelected ? "bg-base-200 font-semibold" : "hover:bg-base-200/50"
                              }`}
                            >
                              <div
                                className="w-5 h-5 rounded-full border border-base-300"
                                style={{ backgroundColor: color.hex }}
                              ></div>
                              <span className="text-sm">{color.color}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <CategoryNav category={category} />
            <AllProducts category={category} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filter;
