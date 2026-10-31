"use client";

import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { LuCloudUpload, LuX } from "react-icons/lu";
import Variations from "./Variations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/api/productApi";
import { toast } from "react-toastify";
import Editor from "./Editor";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";

const ProductForm = ({ ref, setIsPending, initialData }) => {
  const isEditMode = Boolean(initialData?._id);
  const router = useRouter();

  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState,
  } = useForm({
    defaultValues: {
      productName: initialData?.productName || "",
      slug: initialData?.slug || "",
      productDescription: initialData?.productDescription || "",
      price: initialData?.price || "",
      discount: initialData?.discount || "",
      sku: initialData?.sku || "",
      stock: initialData?.stock || "",
      category: initialData?.category || "",
      productImages: initialData?.productImages || [],
      variantDetails: initialData?.variantDetails || [],
    },
  });
  const { errors, isSubmitted } = formState;

  const queryClient = useQueryClient();
  const [variationKey, setVariationKey] = useState(0);
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  const [images, setImages] = useState(initialData?.productImages || []);
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      reset({
        productName: initialData.productName || "",
        slug: initialData.slug || "",
        productDescription: initialData.productDescription || "",
        price: initialData.price || "",
        discount: initialData.discount || "",
        sku: initialData.sku || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
        productImages: initialData.productImages || [],
        variantDetails: initialData.variantDetails || [],
      });
      setImages(initialData.productImages || []);
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEditMode
        ? updateProduct({ id: initialData._id, productData: data })
        : createProduct(data),
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
        setCoverIndex(0);
        setVariationKey((prev) => prev + 1);
      }
    },
    onError: () => {
      toast.error(
        isEditMode ? "Failed to update product" : "Failed to create product",
      );
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

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === coverIndex) setCoverIndex(0);
  };

  useEffect(() => {
    register("productImages", {
      validate: (value) =>
        (value && value.length > 0) || "Upload at least one product image",
    });
  }, [register]);

  useEffect(() => {
    setValue("productImages", images, { shouldValidate: isSubmitted });
  }, [images, setValue, isSubmitted]);

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <div className="lg:col-span-2">
        <div className="fieldset bg-base-100 p-5 rounded-box">
          <h2 className="font-bold text-xl">Basic Information</h2>
          <label htmlFor="productName" className="label">
            Product Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Women's Fashionable Kurti"
            {...register("productName", { required: "Title is required" })}
          />
          {errors.productName && (
            <p className="text-red-600">{errors.productName.message}</p>
          )}

          <label className="label">
            Slug<span className="text-red-600">*</span>
          </label>
          <label className="input w-full">
            <span className="label">https://oiki.store/products/</span>
            <input
              type="text"
              placeholder="womens-fashionable-kurti"
              {...register("slug", { required: "Product Slug is Required" })}
            />
          </label>

          {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}

          <label htmlFor="productDescription" className="label">
            Product Description<span className="text-red-600">*</span>
          </label>
          <Editor control={control} errors={errors} />
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Pricing</h2>
          <div className="flex gap-5 items-center">
            <div className="flex-1">
              <label htmlFor="price" className="label">
                Price<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                className="input w-full"
                placeholder="1000"
                {...register("price", { required: "Price is required" })}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="discount" className="label">
                Discount
              </label>
              <input
                type="number"
                className="input w-full"
                placeholder="1000"
                {...register("discount", { required: false })}
              />
            </div>
          </div>
          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}
        </div>
        <Variations
          key={variationKey}
          register={register}
          control={control}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
          initialVariants={initialData?.variantDetails}
        />
      </div>
      <div>
        <div className="fieldset bg-base-100 p-5 rounded-box">
          <h2 className="font-bold text-xl">Product Images</h2>
          <label className="label">Upload Images</label>
          <label
            className="border border-dashed border-main bg-main/5 rounded-box p-5 cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <LuCloudUpload className="text-main size-25" />
              <h3 className="text-base text-center max-w-55">
                Drag and Drop or click here to Upload Images
              </h3>
            </div>
            <input
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          {/* Preview thumbnails */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded-box border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                  >
                    <LuX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.productImages && (
            <p className="text-red-600 text-sm mt-2">
              {errors.productImages.message}
            </p>
          )}
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Inventory</h2>
          <label htmlFor="sku" className="label">
            SKU
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="OIKIXYZ"
            {...register("sku", { required: false })}
          />

          <label className="label">Stock</label>
          <input
            type="number"
            placeholder="10"
            className="input w-full"
            {...register("stock", { required: false })}
          />
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Categories</h2>
          <label htmlFor="category" className="label">
            Select Category
          </label>
          <select
            defaultValue={initialData?.category || ""}
            className="select w-full"
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled={true}>
              Select a Category
            </option>
            {categoriesLoading ? (
              <option value="" disabled={true}>
                Loading Categories...
              </option>
            ) : categoriesError ? (
              <option value="" disabled={true}>
                Error Loading Categories
              </option>
            ) : (
              categories?.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {errors.category && (
            <p className="text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
