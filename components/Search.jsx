"use client";
import { useEffect, useRef, useState } from "react";
import { LuLoader, LuSearch, LuX } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchProductsApi } from "@/api/productApi";
import TakaSymbol from "./ui/TakaSymbol";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProductsApi(query);
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearchSubmit} className="custom-search relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search sarees, kurtis, dresses..."
          className="bg-transparent text-sm"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="text-base-content/50 hover:text-base-content p-1"
          >
            <LuX className="h-4 w-4" />
          </button>
        )}

        <button type="submit" className="btn btn-main rounded-full shrink-0">
          {loading ? (
            <LuLoader className="h-[1em] animate-spin" />
          ) : (
            <LuSearch className="h-[1em]" />
          )}
          <span>Search</span>
        </button>
      </form>

      {/* Live Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-base-100 rounded-box shadow-2xl border border-base-300 z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-sm text-base-content/60 flex items-center justify-center gap-2">
              <LuLoader className="animate-spin text-main" /> Searching...
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 border-b border-base-200">
                Products
              </div>
              <ul className="divide-y divide-base-200 max-h-80 overflow-y-auto">
                {results.map((product) => {
                  const imageSrc =
                    product.productImages?.[0] ||
                    product.variantDetails?.[0]?.imageGallery?.[0] ||
                    "/assets/oiki-logo.svg";

                  const price =
                    product.discount ||
                    product.variantDetails?.[0]?.sizes?.[0]?.price ||
                    product.price;

                  return (
                    <li key={product._id}>
                      <Link
                        href={`/products/${product.category}/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-base-200/60 transition-colors"
                      >
                        <div className="relative w-12 h-14 bg-base-200 rounded overflow-hidden shrink-0">
                          <Image
                            src={imageSrc}
                            alt={product.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate text-base-content">
                            {product.productName}
                          </h4>
                          <span className="text-xs text-base-content/60 capitalize">
                            {product.category?.replace(/-/g, " ")}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-main shrink-0">
                          <TakaSymbol />
                          {price}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="p-2 bg-base-200/40 text-center border-t border-base-200">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-main hover:underline"
                >
                  View all results for "{query}" &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-base-content/60">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
