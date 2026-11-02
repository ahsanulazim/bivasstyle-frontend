"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CategoryData from "@/components/dashboard/category/CategoryData";
import CategoryModal from "@/components/dashboard/category/CategoryModal";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const CategoriesPage = () => {
  const categoryRef = useRef(null);

  return (
    <>
      <Breadcrumbs title="Categories" />
      <CategoryModal modalRef={categoryRef} />
      <section className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-2xl">Categories</h2>
            <p className="text-xs opacity-60">
              Manage product taxonomies, edit slugs and cover banners.
            </p>
          </div>
          <button
            className="btn btn-main btn-sm gap-1.5"
            onClick={() => categoryRef.current?.showModal()}
          >
            <LuPlus className="size-4" /> Create Category
          </button>
        </div>
      </section>
      <section>
        <CategoryData />
      </section>
    </>
  );
};

export default CategoriesPage;
