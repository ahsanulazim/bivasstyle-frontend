"use client";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CategoryData from "@/components/dashboard/category/CategoryData";
import CategoryModal from "@/components/dashboard/category/CategoryModal";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const categoryRef = useRef(null);

  return (
    <>
      <Breadcrumbs title="Categories" />
      <CategoryModal ref={categoryRef} />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Categories</h2>
          <button
            className="btn btn-main"
            onClick={() => categoryRef.current.showModal()}
          >
            <LuPlus /> Create Category
          </button>
        </div>
      </section>
      <section>
        <CategoryData />
      </section>
    </>
  );
};

export default page;
