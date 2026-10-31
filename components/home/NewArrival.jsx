"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "../ui/ProductCard";
import { getNewArrivals } from "@/api/productApi";
import ProductCardSkeleton from "../ui/skeleton/ProductCardSkeleton";

const NewArrival = () => {
  const { data: newProducts, isLoading } = useQuery({
    queryKey: ["newProducts"],
    queryFn: getNewArrivals,
  });

  return (
    <section className="px-5 mb-5">
      <div className="max-w-360 mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-main">
          New Arrivals
        </h2>
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 md:gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : newProducts?.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
