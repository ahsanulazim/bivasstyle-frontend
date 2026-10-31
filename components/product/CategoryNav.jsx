"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { LuFilter } from "react-icons/lu";

const CategoryNav = ({ category }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAll = !category || category === "all";
  const cleanCategory = isAll ? "All Products" : category.replace(/-/g, " ");
  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (e) => {
    const val = e.target.value;
    const query = new URLSearchParams(searchParams.toString());
    if (val) {
      query.set("sort", val);
    } else {
      query.delete("sort");
    }
    query.set("page", "1");
    const basePath = isAll ? "/products" : `/products/${category}`;
    router.push(`${basePath}?${query.toString()}`);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm rounded-box py-1 px-4">
      <div className="flex-1">
        <label
          htmlFor="my-drawer-3"
          className="btn max-xs:btn-square drawer-button lg:hidden mr-2 btn-sm"
        >
          <LuFilter /> <span className="hidden xs:block">Filter</span>
        </label>
        <span className="font-semibold uppercase text-sm md:text-base">
          {cleanCategory}
        </span>
      </div>
      <div className="flex-none">
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="select select-sm select-bordered"
        >
          <option value="">Default Sorting</option>
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default CategoryNav;
