"use client";

import { getProductBySlug } from "@/api/productApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductForm from "@/components/dashboard/products/add-product/ProductForm";
import Spinner from "@/components/skeleton/Spinner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { LuArrowLeft, LuSave } from "react-icons/lu";

const EditProductContent = () => {
  const formRef = useRef();
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });

  if (!slug) {
    return (
      <div className="p-10 text-center">
        <p className="font-semibold text-error">No product specified to edit.</p>
        <Link href="/dashboard/products" className="btn btn-sm btn-main mt-4">
          Back to Products
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !product) {
    return (
      <div className="p-10 text-center">
        <p className="font-semibold text-error">Product not found.</p>
        <Link href="/dashboard/products" className="btn btn-sm btn-main mt-4">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs title="Products" subtitle="Edit Product" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/products">
              <button className="btn btn-square btn-sm">
                <LuArrowLeft />
              </button>
            </Link>
            <h2 className="font-bold text-2xl">Edit Product</h2>
          </div>
          <button
            className={`btn ${isPending ? "" : "btn-main"}`}
            type="submit"
            disabled={isPending}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span> Saving...
              </>
            ) : (
              <>
                <LuSave /> Update Product
              </>
            )}
          </button>
        </div>
      </section>
      <section>
        <ProductForm
          ref={formRef}
          setIsPending={setIsPending}
          initialData={product}
        />
      </section>
    </>
  );
};

const EditProductPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <EditProductContent />
    </Suspense>
  );
};

export default EditProductPage;
