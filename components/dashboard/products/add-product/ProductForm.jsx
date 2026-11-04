"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  LuCloudUpload,
  LuX,
  LuSparkles,
  LuCheck,
  LuStar,
  LuSave,
  LuArrowLeft,
  LuTrendingUp,
  LuLoader,
} from "react-icons/lu";
import Variations from "./Variations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  uploadProductImages,
} from "@/api/productApi";
import { toast } from "react-toastify";
import Editor from "./Editor";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ProductForm = ({ ref, setIsPending, initialData }) => {
  const isEditMode = Boolean(initialData?._id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hasVariants, setHasVariants] = useState(
    initialData?.hasVariants !== undefined
      ? Boolean(initialData.hasVariants)
      : Array.isArray(initialData?.variantDetails) &&
          initialData.variantDetails.length > 0,
  );

  const [images, setImages] = useState(initialData?.productImages || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEditMode);

  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState,
  } = useForm({
    defaultValues: {
      productName: initialData?.productName || "",
      slug: initialData?.slug || "",
      productDescription: initialData?.productDescription || "",
      price: initialData?.price || "",
      costPrice: initialData?.costPrice || "",
      discount: initialData?.discount || "",
      sku: initialData?.sku || "",
      barcode: initialData?.barcode || "",
      stock: initialData?.stock || "",
      category: initialData?.category || "",
      status: initialData?.status || "published",
      featured: Boolean(initialData?.featured || false),
      weight: initialData?.weight || "",
      lowStockThreshold: initialData?.lowStockThreshold ?? 5,
      productImages: initialData?.productImages || [],
      hasVariants:
        initialData?.hasVariants !== undefined
          ? Boolean(initialData.hasVariants)
          : Array.isArray(initialData?.variantDetails) &&
            initialData.variantDetails.length > 0,
      variantDetails: initialData?.variantDetails || [],
    },
  });

  const { errors, isSubmitted } = formState;

  // Sync initialData on edit mode
  useEffect(() => {
    if (initialData) {
      const variantsExist =
        initialData?.hasVariants !== undefined
          ? Boolean(initialData.hasVariants)
          : Array.isArray(initialData?.variantDetails) &&
            initialData.variantDetails.length > 0;

      setHasVariants(variantsExist);
      setImages(initialData.productImages || []);
      reset({
        productName: initialData.productName || "",
        slug: initialData.slug || "",
        productDescription: initialData.productDescription || "",
        price: initialData.price || "",
        costPrice: initialData.costPrice || "",
        discount: initialData.discount || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
        status: initialData.status || "published",
        featured: Boolean(initialData.featured || false),
        weight: initialData.weight || "",
        lowStockThreshold: initialData.lowStockThreshold ?? 5,
        productImages: initialData.productImages || [],
        hasVariants: variantsExist,
        variantDetails: initialData.variantDetails || [],
      });
    }
  }, [initialData, reset]);

  // Keep images registered & validated
  useEffect(() => {
    register("productImages", {
      validate: (value) =>
        (value && value.length > 0) ||
        "Please upload at least one product image",
    });
  }, [register]);

  useEffect(() => {
    setValue("productImages", images, { shouldValidate: isSubmitted });
  }, [images, setValue, isSubmitted]);

  useEffect(() => {
    setValue("hasVariants", hasVariants);
  }, [hasVariants, setValue]);

  // Pricing & Profit Calculation watches
  const watchPrice = watch("price");
  const watchCostPrice = watch("costPrice");
  const watchDiscount = watch("discount");

  const numPrice = Number(watchPrice || 0);
  const numCost = Number(watchCostPrice || 0);
  const numSale = Number(watchDiscount || 0);

  const discountSavings =
    numPrice > 0 && numSale > 0 && numSale < numPrice ? numPrice - numSale : 0;
  const discountPct =
    discountSavings > 0 ? Math.round((discountSavings / numPrice) * 100) : 0;

  const effectiveSelling =
    numSale > 0 && numSale < numPrice ? numSale : numPrice;
  const netProfit =
    effectiveSelling > 0 && numCost > 0 ? effectiveSelling - numCost : null;
  const marginPct =
    netProfit !== null && effectiveSelling > 0
      ? Math.round((netProfit / effectiveSelling) * 100)
      : null;

  // Auto-slug generator on title input
  const handleTitleInput = (e) => {
    const val = e.target.value;
    setValue("productName", val);
    if (!isSlugManuallyEdited) {
      setValue("slug", slugify(val), { shouldValidate: isSubmitted });
    }
  };

  const regenerateSlug = () => {
    const title = getValues("productName");
    setValue("slug", slugify(title), { shouldValidate: true });
    setIsSlugManuallyEdited(false);
    toast.info("Slug generated from product title");
  };

  // Image upload handling with Cloudinary API
  const handleImageFiles = async (files) => {
    const fileList = Array.from(files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!fileList.length) return;

    setUploadingImages(true);
    try {
      const res = await uploadProductImages(fileList);
      if (res.urls && res.urls.length > 0) {
        setImages((prev) => [...prev, ...res.urls]);
        toast.success(`${res.urls.length} image(s) uploaded successfully`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to upload image(s). Check network.",
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const makeCoverImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    toast.info("Cover image updated");
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      const normalizedVariants =
        hasVariants && Array.isArray(data.variantDetails)
          ? data.variantDetails.map((v) => {
              const hasSizes = Array.isArray(v.sizes) && v.sizes.length > 0;
              return {
                ...v,
                price:
                  v.price !== undefined && v.price !== "" ? Number(v.price) : 0,
                discount:
                  v.discount !== undefined && v.discount !== ""
                    ? Number(v.discount)
                    : 0,
                stock:
                  v.stock !== undefined && v.stock !== "" ? Number(v.stock) : 0,
                sku: v.sku || "",
                sizes: hasSizes
                  ? v.sizes.map((s) => ({
                      ...s,
                      price: Number(s.price || 0),
                      discount:
                        s.discount !== undefined && s.discount !== ""
                          ? Number(s.discount)
                          : 0,
                      stock: Number(s.stock || 0),
                      sku: s.sku || "",
                    }))
                  : [],
              };
            })
          : [];

      const payload = {
        ...data,
        price: Number(data.price || 0),
        costPrice: data.costPrice !== "" ? Number(data.costPrice) : 0,
        discount: data.discount !== "" ? Number(data.discount) : 0,
        stock: Number(data.stock || 0),
        hasVariants,
        variantDetails: normalizedVariants,
      };
      return isEditMode
        ? updateProduct({ id: initialData._id, productData: payload })
        : createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (isEditMode) {
        queryClient.invalidateQueries({
          queryKey: ["product", initialData.slug],
        });
        toast.success("Product updated successfully");
        router.push("/dashboard/products");
      } else {
        toast.success("Product created successfully");
        reset();
        setImages([]);
        setHasVariants(false);
        setIsSlugManuallyEdited(false);
        router.push("/dashboard/products");
      }
    },
    onError: (err) => {
      const message =
        err.response?.data?.message ||
        (isEditMode ? "Failed to update product" : "Failed to create product");
      toast.error(message);
    },
  });

  useEffect(() => {
    if (setIsPending) {
      setIsPending(mutation.isPending);
    }
  }, [mutation.isPending, setIsPending]);

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className="pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* LEFT COLUMN: Main Form Elements */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <h2 className="font-bold text-xl mb-4">Basic Information</h2>

          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="label text-xs font-semibold"
            >
              Product Title<span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="productName"
              className={`input w-full ${errors.productName ? "input-error" : ""}`}
              placeholder="e.g. Women's Cotton Party Kurti"
              {...register("productName", {
                required: "Product Title is required",
              })}
              onChange={handleTitleInput}
            />
            {errors.productName && (
              <p className="text-error text-xs mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Slug input with auto-generator */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="slug" className="label text-xs font-semibold">
                SEO URL Slug<span className="text-error">*</span>
              </label>
              <button
                type="button"
                onClick={regenerateSlug}
                className="btn btn-ghost btn-xs text-primary gap-1"
                title="Regenerate slug from current product title"
              >
                <LuSparkles className="size-3" /> Auto Slug
              </button>
            </div>
            <label className="input w-full flex items-center gap-1 font-mono text-xs">
              <span className="opacity-50 select-none hidden sm:inline">
                bivasstyle.com/products/
              </span>
              <input
                type="text"
                id="slug"
                className="grow"
                placeholder="womens-cotton-party-kurti"
                {...register("slug", {
                  required: "Product Slug is required",
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message:
                      "Slug must be lowercase alphanumeric with hyphens only",
                  },
                })}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setValue(
                    "slug",
                    e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  );
                }}
              />
            </label>
            {errors.slug && (
              <p className="text-error text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Product Description */}
          <div className="mt-4">
            <label className="label text-xs font-semibold">
              Product Description<span className="text-error">*</span>
            </label>
            <Editor control={control} errors={errors} />
          </div>
        </div>

        {/* Pricing & Profit Margin Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-xl">Pricing & Financials</h2>
              <p className="text-xs text-base-content/60">
                Set regular retail price, offer sale price, and product cost.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              <LuTrendingUp className="size-3.5" /> Margin Analytics
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Regular Selling Price */}
            <div>
              <label htmlFor="price" className="label text-xs font-semibold">
                Regular Selling Price (BDT)<span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="price"
                min="0"
                className={`input w-full ${errors.price ? "input-error" : ""}`}
                placeholder="1000"
                {...register("price", {
                  required: "Regular Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
              />
              {errors.price && (
                <p className="text-error text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Sale Price / Offer Price */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="discount"
                  className="label text-xs font-semibold"
                >
                  Sale / Offer Price (BDT)
                </label>
                {discountSavings > 0 && (
                  <span className="badge badge-xs badge-success text-[10px] font-bold">
                    Save ৳{discountSavings} ({discountPct}% off)
                  </span>
                )}
              </div>
              <input
                type="number"
                id="discount"
                min="0"
                className={`input w-full ${errors.discount ? "input-error" : ""}`}
                placeholder="900"
                {...register("discount", {
                  validate: (val) => {
                    if (!val) return true;
                    const num = Number(val);
                    const reg = Number(getValues("price") || 0);
                    if (num <= 0) return "Sale price must be greater than 0";
                    if (reg > 0 && num >= reg)
                      return "Sale price must be less than regular price";
                    return true;
                  },
                })}
              />
              {errors.discount && (
                <p className="text-error text-xs mt-1">
                  {errors.discount.message}
                </p>
              )}
              <span className="text-[10px] text-base-content/50 block mt-1">
                Leave empty if selling at regular price.
              </span>
            </div>

            {/* Cost Price */}
            <div>
              <label
                htmlFor="costPrice"
                className="label text-xs font-semibold"
              >
                Cost Price (Buying/Prod)
              </label>
              <input
                type="number"
                id="costPrice"
                min="0"
                className="input w-full"
                placeholder="600"
                {...register("costPrice")}
              />
              <span className="text-[10px] text-base-content/50 block mt-1">
                For net profit & margin calculation.
              </span>
            </div>
          </div>

          {/* Realtime Profit & Margin Card */}
          {numCost > 0 && effectiveSelling > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-base-200/60 border border-base-300 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-base-content/60 block">
                  Estimated Net Profit per piece
                </span>
                <span
                  className={`text-lg font-bold ${netProfit >= 0 ? "text-success" : "text-error"}`}
                >
                  ৳{netProfit} BDT
                </span>
              </div>
              <div>
                <span className="text-xs text-base-content/60 block">
                  Profit Margin
                </span>
                <span
                  className={`text-lg font-bold ${marginPct >= 0 ? "text-success" : "text-error"}`}
                >
                  {marginPct}%
                </span>
              </div>
              <div className="text-xs text-base-content/60 max-w-xs">
                Selling at ৳{effectiveSelling} with cost ৳{numCost}.
              </div>
            </div>
          )}
        </div>

        {/* Product Type & Variations Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl">Product Type & Variations</h2>
              <p className="text-xs text-base-content/60">
                Choose whether this is a Simple Product (single item) or has
                Color/Size variants.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">
                {hasVariants ? "Variable Product" : "Simple Product"}
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
            </div>
          </div>

          {!hasVariants && (
            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 text-xs text-base-content/80 flex items-center justify-between">
              <div>
                <strong className="block text-primary text-sm font-bold">
                  Simple Product Mode Active
                </strong>
                No color or size options needed. The product will sell at the
                main price and use root inventory stock.
              </div>
            </div>
          )}
        </div>

        {/* Variations Component (Rendered only when hasVariants is active) */}
        {hasVariants && (
          <Variations
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            initialVariants={initialData?.variantDetails}
          />
        )}
      </div>

      {/* RIGHT COLUMN: Media, Categories, Status, Logistics */}
      <div className="space-y-6">
        {/* Product Images Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Product Images</h2>
            <span className="badge badge-sm badge-neutral font-medium">
              {images.length} Image(s)
            </span>
          </div>

          {/* Upload Dropzone */}
          <label
            className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center transition text-center ${
              uploadingImages
                ? "border-primary bg-primary/5 opacity-80"
                : "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleImageFiles(e.dataTransfer.files);
            }}
          >
            {uploadingImages ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <LuLoader className="size-10 animate-spin text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Uploading to Cloudinary...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <LuCloudUpload className="text-primary size-10" />
                <span className="text-sm font-semibold">
                  Click or drag images here
                </span>
                <span className="text-xs text-base-content/50">
                  PNG, JPG, WEBP up to 10MB each
                </span>
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploadingImages}
              onChange={(e) => handleImageFiles(e.target.files)}
            />
          </label>

          {/* Image Previews & Cover Selection */}
          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              <span className="text-xs text-base-content/60 block">
                First image is your main <strong>Cover Image</strong>. Click
                'Make Cover' on any image to change.
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((url, i) => (
                  <div
                    key={url + i}
                    className="relative group rounded-xl overflow-hidden border border-base-300 aspect-square"
                  >
                    <img
                      src={url}
                      alt={`Product media ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 ? (
                      <span className="absolute top-1 left-1 badge badge-success text-[10px] font-bold shadow-xs">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeCoverImage(i)}
                        className="absolute bottom-1 left-1 right-1 btn btn-xs btn-neutral opacity-0 group-hover:opacity-100 transition text-[10px]"
                      >
                        Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 btn btn-circle btn-error btn-xs size-6 shadow-xs"
                      title="Delete image"
                    >
                      <LuX className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.productImages && (
            <p className="text-error text-xs mt-2">
              {errors.productImages.message}
            </p>
          )}
        </div>

        {/* Category Selection Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <h2 className="font-bold text-lg mb-3">Product Category</h2>
          <label htmlFor="category" className="label text-xs font-semibold">
            Select Category<span className="text-error">*</span>
          </label>
          <select
            id="category"
            className={`select w-full ${errors.category ? "select-error" : ""}`}
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled>
              {categoriesLoading
                ? "Loading Categories..."
                : categoriesError
                  ? "Error Loading Categories"
                  : "Select a Category"}
            </option>
            {categories?.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-error text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Status & Visibility Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <h2 className="font-bold text-lg mb-3">Status & Visibility</h2>
          <label htmlFor="status" className="label text-xs font-semibold">
            Storefront Visibility
          </label>
          <select id="status" className="select w-full" {...register("status")}>
            <option value="published">Published (Visible in store)</option>
            <option value="draft">Draft (Hidden from store)</option>
            <option value="archived">Archived</option>
          </select>

          <div className="mt-4 flex items-center justify-between p-3.5 bg-base-200/60 rounded-xl">
            <div>
              <span className="font-bold text-xs block">Featured Product</span>
              <span className="text-[11px] opacity-60">
                Display on homepage showcase
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              {...register("featured")}
            />
          </div>
        </div>

        {/* Inventory & Logistics Card */}
        <div className="fieldset bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs">
          <h2 className="font-bold text-lg mb-3">Inventory & Shipping</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sku" className="label text-xs font-semibold">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                className="input w-full"
                placeholder="BV-KUR-01"
                {...register("sku")}
              />
            </div>
            <div>
              <label htmlFor="barcode" className="label text-xs font-semibold">
                Barcode / GTIN
              </label>
              <input
                type="text"
                id="barcode"
                className="input w-full"
                placeholder="890123456"
                {...register("barcode")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="stock" className="label text-xs font-semibold">
                Stock Quantity{hasVariants ? " (Variants Sum)" : "*"}
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                disabled={hasVariants}
                className={`input w-full ${hasVariants ? "bg-base-200 opacity-70 cursor-not-allowed" : ""}`}
                placeholder={hasVariants ? "Auto from variants" : "10"}
                {...register("stock", {
                  required: hasVariants
                    ? false
                    : "Stock quantity is required for simple product",
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />
              {errors.stock && (
                <p className="text-error text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lowStockThreshold"
                className="label text-xs font-semibold"
              >
                Low Stock Alert
              </label>
              <input
                type="number"
                id="lowStockThreshold"
                min="0"
                className="input w-full"
                placeholder="5"
                {...register("lowStockThreshold")}
              />
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="weight" className="label text-xs font-semibold">
              Package Weight (KG)
            </label>
            <input
              type="number"
              id="weight"
              step="0.01"
              min="0"
              placeholder="0.5"
              className="input w-full"
              {...register("weight")}
            />
            <p className="text-[10px] text-base-content/50 mt-1">
              Used for automated Steadfast & Courier shipping calculation.
            </p>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-base-100/90 backdrop-blur-md border-t border-base-300 py-3.5 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard/products"
            className="btn btn-sm btn-ghost gap-2"
          >
            <LuArrowLeft className="size-4" /> Cancel & Back
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={mutation.isPending || uploadingImages}
              className="btn btn-sm btn-primary px-6 gap-2"
            >
              {mutation.isPending ? (
                <>
                  <LuLoader className="size-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <LuSave className="size-4" />{" "}
                  {isEditMode ? "Update Product" : "Save Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
