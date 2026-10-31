"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductForm from "@/components/dashboard/products/add-product/ProductForm";
import { useRef, useState } from "react";
import { LuSave } from "react-icons/lu";

const page = () => {
  const formRef = useRef();
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Breadcrumbs title="Products" subtitle="Add-Product" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Add Product</h2>
          <button
            className={`btn ${isPending ? "" : "btn-main"}`}
            type="submit"
            disabled={isPending}
            onClick={() => formRef.current.requestSubmit()}
          >
            {isPending ? (
             <> <span className="loading loading-spinner"></span> Saving...</>
            ) : (
              <>
                <LuSave /> Save
              </>
            )}
          </button>
        </div>
      </section>
      <section>
        <div className="">
          <ProductForm ref={formRef} setIsPending={setIsPending} />
        </div>
      </section>
    </>
  );
};

export default page;
