"use client";

import { getAllCategories } from "@/api/categoryApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import CategoryCard from "../ui/CategoryCard";

const CategoryCardSkeleton = () => {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden skeleton shadow-xs">
      <div className="absolute inset-x-4 bottom-4 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-md bg-base-300/80"></div>
        <div className="skeleton h-5 w-3/4 rounded-lg bg-base-300/80"></div>
      </div>
    </div>
  );
};

const Categories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Filter categories marked as featured by admin; fallback to first few if none marked featured yet
  const displayedCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    const featured = categories.filter((c) => Boolean(c.isFeatured));
    if (featured.length > 0) return featured;
    return categories.slice(0, 4);
  }, [categories]);

  if (!isLoading && displayedCategories.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 mb-8 sm:mb-12">
      <div className="max-w-360 mx-auto">
        {/* Header with Title and "View All" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-main font-semibold text-xs sm:text-sm uppercase tracking-wider mb-1">
              <LuSparkles className="size-3.5" />
              <span>Curated For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content">
              Popular Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-main hover:text-main/80 transition group self-start sm:self-end"
          >
            <span>View All Categories</span>
            <LuArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : displayedCategories.map((category) => (
                <CategoryCard
                  key={category._id || category.slug || category.name}
                  category={category}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
