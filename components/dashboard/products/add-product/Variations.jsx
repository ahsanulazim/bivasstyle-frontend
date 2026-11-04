"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAllAttribute, updateAttribute } from "@/api/attributeApi";
import { getAllVariations } from "@/api/typeApi";
import { uploadProductImages } from "@/api/productApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreatableSelect from "react-select/creatable";
import { LuPlus, LuX, LuSparkles, LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";

const Variations = ({
  register,
  setValue,
  getValues,
  errors,
  initialVariants,
}) => {
  const queryClient = useQueryClient();

  // 1. Fetch attributes (the primary single source of truth)
  const { data: attributes = [], isLoading: attributesLoading } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAllAttribute,
  });

  // 2. Fetch legacy variations if any exist
  const { data: variations = [], isLoading: variationsLoading } = useQuery({
    queryKey: ["all-variations"],
    queryFn: getAllVariations,
  });

  const isLoadingOptions = attributesLoading || variationsLoading;

  // Derive Color Options
  const colorOptions = useMemo(() => {
    const colorAttr = attributes?.find(
      (attr) =>
        attr.slug === "color" ||
        attr.type === "color" ||
        attr.name?.toLowerCase() === "color",
    );

    const fromAttr = (colorAttr?.variations || []).map((item, idx) => {
      if (typeof item === "string") {
        return {
          id: `attr-col-${idx}`,
          label: item,
          value: item,
          swatchImage: null,
        };
      }
      return {
        id: item._id || `attr-col-${idx}`,
        label: item.name || item.value,
        value: item.value || item.name,
        swatchImage: item.image ?? item.swatchImage ?? null,
      };
    });

    const fromVarColl = (variations || [])
      .filter((v) => v.attributeSlug === "color")
      .map((item) => ({
        id: item._id,
        label: item.name,
        value: item.value,
        swatchImage: item.image ?? item.swatchImage ?? null,
      }));

    const combined = [...fromAttr];
    for (const v of fromVarColl) {
      if (
        !combined.some(
          (c) => c.label.toLowerCase() === v.label.toLowerCase(),
        )
      ) {
        combined.push(v);
      }
    }
    return combined;
  }, [attributes, variations]);

  // Derive Size Options
  const sizeOptions = useMemo(() => {
    const sizeAttr = attributes?.find(
      (attr) =>
        attr.slug === "size" ||
        attr.type === "button" ||
        attr.name?.toLowerCase() === "size",
    );

    const fromAttr = (sizeAttr?.variations || []).map((item, idx) => {
      if (typeof item === "string") {
        return {
          id: `attr-sz-${idx}`,
          label: item,
          value: item,
        };
      }
      return {
        id: item._id || `attr-sz-${idx}`,
        label: item.name || item.value,
        value: item.value || item.name,
      };
    });

    const fromVarColl = (variations || [])
      .filter((v) => v.attributeSlug === "size")
      .map((item) => ({
        id: item._id,
        label: item.name,
        value: item.value,
      }));

    const combined = [...fromAttr];
    for (const v of fromVarColl) {
      if (
        !combined.some(
          (s) => s.label.toLowerCase() === v.label.toLowerCase(),
        )
      ) {
        combined.push(v);
      }
    }
    return combined;
  }, [attributes, variations]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizesByColor, setSelectedSizesByColor] = useState({});
  const [colorMeta, setColorMeta] = useState({});
  const [uploadingMeta, setUploadingMeta] = useState({});
  const [bulkInputs, setBulkInputs] = useState({});
  const initializedRef = useRef(false);

  // Initialize from initialVariants once (edit mode)
  useEffect(() => {
    if (
      !initializedRef.current &&
      Array.isArray(initialVariants) &&
      initialVariants.length > 0
    ) {
      const initColors = initialVariants.map((v) => ({
        label: v.color,
        value: v.hex || "#000000",
        swatchImage: v.swatchImage || null,
      }));
      const initSizes = {};
      const initMeta = {};

      initialVariants.forEach((v) => {
        initSizes[v.color] = (v.sizes || []).map((s) => ({
          label: s.size,
          value: s.size,
        }));
        initMeta[v.color] = {
          swatchImage: v.swatchImage || null,
          imageGallery: v.imageGallery || [],
        };
      });

      setSelectedColors(initColors);
      setSelectedSizesByColor(initSizes);
      setColorMeta(initMeta);
      setValue("variantDetails", initialVariants, { shouldDirty: false });
      initialVariants.forEach((v, idx) => {
        if (v.price !== undefined) setValue(`variantDetails.${idx}.price`, v.price);
        if (v.discount !== undefined) setValue(`variantDetails.${idx}.discount`, v.discount);
        if (v.stock !== undefined) setValue(`variantDetails.${idx}.stock`, v.stock);
        if (v.sku !== undefined) setValue(`variantDetails.${idx}.sku`, v.sku);
      });
      initializedRef.current = true;
    }
  }, [initialVariants, setValue]);

  // Mutation to persist on-the-fly created values to the Attribute definition
  const updateAttrMutation = useMutation({
    mutationFn: updateAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  const normalizeOptions = (options) => options ?? [];

  const handleColorChange = (colors) => {
    const nextColors = normalizeOptions(colors);
    setSelectedColors(nextColors);
    setSelectedSizesByColor((previous) => {
      const next = {};
      nextColors.forEach((color) => {
        next[color.label] = previous[color.label] ?? [];
      });
      return next;
    });
    setColorMeta((previous) => {
      const next = {};
      nextColors.forEach((color) => {
        next[color.label] = previous[color.label] ?? {
          swatchImage: color.swatchImage || null,
          imageGallery: [],
        };
      });
      return next;
    });
  };

  const handleCreateColor = (inputValue) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newColor = {
      label: trimmed,
      value: trimmed,
      swatchImage: null,
    };
    handleColorChange([...selectedColors, newColor]);

    // Persist in background if Color attribute exists
    const colorAttr = attributes?.find(
      (a) =>
        a.slug === "color" ||
        a.type === "color" ||
        a.name?.toLowerCase() === "color",
    );
    if (colorAttr && colorAttr._id) {
      const currentVars = Array.isArray(colorAttr.variations)
        ? colorAttr.variations
        : [];
      updateAttrMutation.mutate({
        id: colorAttr._id,
        attributeData: {
          ...colorAttr,
          variations: [...currentVars, { name: trimmed, value: trimmed }],
        },
      });
      toast.success(`"${trimmed}" saved to Color attribute`);
    }
  };

  const handleSizeChange = (colorLabel, sizes) => {
    setSelectedSizesByColor((previous) => ({
      ...previous,
      [colorLabel]: normalizeOptions(sizes),
    }));
  };

  const handleCreateSize = (colorLabel, inputValue) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newSize = { label: trimmed, value: trimmed };
    const current = selectedSizesByColor[colorLabel] || [];
    handleSizeChange(colorLabel, [...current, newSize]);

    // Persist in background if Size attribute exists
    const sizeAttr = attributes?.find(
      (a) =>
        a.slug === "size" ||
        a.type === "button" ||
        a.name?.toLowerCase() === "size",
    );
    if (sizeAttr && sizeAttr._id) {
      const currentVars = Array.isArray(sizeAttr.variations)
        ? sizeAttr.variations
        : [];
      updateAttrMutation.mutate({
        id: sizeAttr._id,
        attributeData: {
          ...sizeAttr,
          variations: [...currentVars, { name: trimmed, value: trimmed }],
        },
      });
      toast.success(`"${trimmed}" saved to Size attribute`);
    }
  };

  const handleSwatchUpload = async (colorLabel, file) => {
    if (!file) return;
    setUploadingMeta((prev) => ({ ...prev, [`${colorLabel}-swatch`]: true }));
    try {
      const res = await uploadProductImages([file]);
      if (res.urls && res.urls[0]) {
        setColorMeta((previous) => ({
          ...previous,
          [colorLabel]: {
            ...previous[colorLabel],
            swatchImage: res.urls[0],
          },
        }));
        toast.success("Swatch image uploaded");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload swatch image",
      );
    } finally {
      setUploadingMeta((prev) => ({
        ...prev,
        [`${colorLabel}-swatch`]: false,
      }));
    }
  };

  const handleGalleryUpload = async (colorLabel, files) => {
    const fileArray = Array.from(files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!fileArray.length) return;

    setUploadingMeta((prev) => ({ ...prev, [`${colorLabel}-gallery`]: true }));
    try {
      const res = await uploadProductImages(fileArray);
      if (res.urls && res.urls.length > 0) {
        setColorMeta((previous) => ({
          ...previous,
          [colorLabel]: {
            ...previous[colorLabel],
            imageGallery: [
              ...(previous[colorLabel]?.imageGallery ?? []),
              ...res.urls,
            ],
          },
        }));
        toast.success(`${res.urls.length} gallery image(s) uploaded`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload gallery images",
      );
    } finally {
      setUploadingMeta((prev) => ({
        ...prev,
        [`${colorLabel}-gallery`]: false,
      }));
    }
  };

  const removeGalleryImage = (colorLabel, indexToRemove) => {
    setColorMeta((previous) => ({
      ...previous,
      [colorLabel]: {
        ...previous[colorLabel],
        imageGallery: (previous[colorLabel]?.imageGallery ?? []).filter(
          (_, index) => index !== indexToRemove,
        ),
      },
    }));
  };

  const removeSwatchImage = (colorLabel) => {
    setColorMeta((previous) => ({
      ...previous,
      [colorLabel]: {
        ...previous[colorLabel],
        swatchImage: null,
      },
    }));
  };

  // Bulk fill inputs for a given color
  const handleBulkChange = (colorLabel, field, value) => {
    setBulkInputs((prev) => ({
      ...prev,
      [colorLabel]: {
        ...(prev[colorLabel] || {}),
        [field]: value,
      },
    }));
  };

  const applyBulkToSizes = (colorLabel, colorIndex) => {
    const bulk = bulkInputs[colorLabel] || {};
    const sizes = selectedSizesByColor[colorLabel] || [];
    if (!sizes.length) {
      toast.info("Please select sizes first");
      return;
    }

    sizes.forEach((_, sizeIndex) => {
      if (bulk.price !== undefined && bulk.price !== "") {
        setValue(
          `variantDetails.${colorIndex}.sizes.${sizeIndex}.price`,
          bulk.price,
          { shouldDirty: true },
        );
      }
      if (bulk.discount !== undefined && bulk.discount !== "") {
        setValue(
          `variantDetails.${colorIndex}.sizes.${sizeIndex}.discount`,
          bulk.discount,
          { shouldDirty: true },
        );
      }
      if (bulk.stock !== undefined && bulk.stock !== "") {
        setValue(
          `variantDetails.${colorIndex}.sizes.${sizeIndex}.stock`,
          bulk.stock,
          { shouldDirty: true },
        );
      }
      if (bulk.skuPrefix) {
        setValue(
          `variantDetails.${colorIndex}.sizes.${sizeIndex}.sku`,
          `${bulk.skuPrefix}-${sizes[sizeIndex].label}`,
          { shouldDirty: true },
        );
      }
    });

    toast.success(
      `Applied values to all ${sizes.length} sizes in ${colorLabel}!`,
    );
  };

  // Synchronize variant metadata when colors/sizes/images change
  useEffect(() => {
    if (selectedColors.length === 0 && !initializedRef.current) return;

    const previousVariantDetails = getValues("variantDetails") || [];

    const nextVariantDetails = selectedColors.map((color, colorIdx) => {
      const colorSizes = selectedSizesByColor[color.label] ?? [];
      const previousColor = previousVariantDetails.find(
        (item) => item.color === color.label,
      );

      const colorPriceVal = getValues(`variantDetails.${colorIdx}.price`);
      const colorDiscountVal = getValues(`variantDetails.${colorIdx}.discount`);
      const colorStockVal = getValues(`variantDetails.${colorIdx}.stock`);
      const colorSkuVal = getValues(`variantDetails.${colorIdx}.sku`);

      const sizes = colorSizes.map((size, sizeIdx) => {
        const formValPrice = getValues(
          `variantDetails.${colorIdx}.sizes.${sizeIdx}.price`,
        );
        const formValDiscount = getValues(
          `variantDetails.${colorIdx}.sizes.${sizeIdx}.discount`,
        );
        const formValStock = getValues(
          `variantDetails.${colorIdx}.sizes.${sizeIdx}.stock`,
        );
        const formValSku = getValues(
          `variantDetails.${colorIdx}.sizes.${sizeIdx}.sku`,
        );

        const previousSize = previousColor?.sizes?.find(
          (item) => item.size === size.label,
        );

        return {
          size: size.label,
          price:
            formValPrice !== undefined && formValPrice !== ""
              ? formValPrice
              : (previousSize?.price ?? ""),
          discount:
            formValDiscount !== undefined && formValDiscount !== ""
              ? formValDiscount
              : (previousSize?.discount ?? ""),
          stock:
            formValStock !== undefined && formValStock !== ""
              ? formValStock
              : (previousSize?.stock ?? ""),
          sku:
            formValSku !== undefined && formValSku !== ""
              ? formValSku
              : (previousSize?.sku ?? ""),
        };
      });

      return {
        color: color.label,
        hex: color.value,
        swatchImage:
          colorMeta[color.label]?.swatchImage ??
          previousColor?.swatchImage ??
          color.swatchImage ??
          null,
        imageGallery:
          colorMeta[color.label]?.imageGallery ??
          previousColor?.imageGallery ??
          [],
        price:
          colorPriceVal !== undefined && colorPriceVal !== ""
            ? colorPriceVal
            : (previousColor?.price ?? ""),
        discount:
          colorDiscountVal !== undefined && colorDiscountVal !== ""
            ? colorDiscountVal
            : (previousColor?.discount ?? ""),
        stock:
          colorStockVal !== undefined && colorStockVal !== ""
            ? colorStockVal
            : (previousColor?.stock ?? ""),
        sku:
          colorSkuVal !== undefined && colorSkuVal !== ""
            ? colorSkuVal
            : (previousColor?.sku ?? ""),
        sizes,
      };
    });

    setValue("variantDetails", nextVariantDetails, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedColors, selectedSizesByColor, colorMeta, getValues, setValue]);

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box mt-5 border border-base-200 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-xl">Product Variations</h2>
        <span className="badge badge-sm badge-primary badge-outline font-medium">
          Color & Size Matrix
        </span>
      </div>
      <p className="text-xs text-base-content/60 mb-4">
        Select colors and sizes available for this product. You can customize
        price, sale price, and stock per variant.
      </p>

      {/* Color Select */}
      <div className="mb-4">
        <label htmlFor="colors" className="label text-xs font-semibold">
          Select Colors
        </label>
        <CreatableSelect
          value={selectedColors}
          onChange={handleColorChange}
          onCreateOption={handleCreateColor}
          options={colorOptions}
          isMulti
          isLoading={isLoadingOptions}
          placeholder="Choose available colors or type to create new..."
          className="text-sm"
          formatOptionLabel={(option) => {
            const isColor =
              typeof option.value === "string" &&
              (option.value.startsWith("#") ||
                option.value.startsWith("rgb"));
            return (
              <div className="flex items-center gap-2">
                {isColor ? (
                  <span
                    className="size-3.5 rounded-full border border-black/15 shadow-2xs inline-block shrink-0"
                    style={{ backgroundColor: option.value }}
                  />
                ) : (
                  <span className="size-3.5 rounded-full border border-black/15 bg-primary/20 inline-block shrink-0" />
                )}
                <span className="font-medium">{option.label}</span>
                {isColor && (
                  <span className="text-[10px] opacity-40 font-mono">
                    {option.value}
                  </span>
                )}
              </div>
            );
          }}
        />
        <span className="text-[10px] text-base-content/50 block mt-1">
          Tip: You can select existing colors or type a new one and press Enter.
        </span>
      </div>

      {selectedColors.length > 0 && (
        <div className="mt-6 space-y-6">
          {selectedColors.map((color, colorIndex) => {
            const gallery = colorMeta[color.label]?.imageGallery ?? [];
            const swatchImage = colorMeta[color.label]?.swatchImage ?? null;
            const isSwatchUploading = uploadingMeta[`${color.label}-swatch`];
            const isGalleryUploading = uploadingMeta[`${color.label}-gallery`];
            const colorSizes = selectedSizesByColor[color.label] ?? [];

            const isHex =
              typeof color.value === "string" &&
              (color.value.startsWith("#") || color.value.startsWith("rgb"));

            return (
              <div
                key={color.label}
                className="border border-base-300 rounded-2xl p-5 bg-base-100 shadow-xs"
              >
                {/* Color Header */}
                <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <label
                      className="size-7 rounded-full shadow-inner border border-base-300 cursor-pointer overflow-hidden relative flex items-center justify-center shrink-0"
                      title="Click to adjust color shade"
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: isHex ? color.value : "#000000",
                        }}
                      />
                      <input
                        type="color"
                        value={
                          color.value?.startsWith("#")
                            ? color.value
                            : "#000000"
                        }
                        onChange={(e) => {
                          const newHex = e.target.value;
                          setSelectedColors((prev) =>
                            prev.map((c) =>
                              c.label === color.label
                                ? { ...c, value: newHex }
                                : c,
                            ),
                          );
                        }}
                        className="opacity-0 absolute inset-0 cursor-pointer"
                      />
                    </label>
                    <div>
                      <h4 className="font-bold text-base">{color.label}</h4>
                      <span className="text-xs text-base-content/50 font-mono">
                        {color.value}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`badge badge-sm font-medium ${
                      colorSizes.length > 0
                        ? "badge-neutral"
                        : "badge-primary badge-outline"
                    }`}
                  >
                    {colorSizes.length > 0
                      ? `${colorSizes.length} Size(s) Selected`
                      : "Color Only (No Sizes)"}
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                  {/* Left Column: Swatch & Gallery Images */}
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <span className="text-xs font-semibold block mb-1">
                        Color Swatch Image (Thumbnail / Fabric)
                      </span>
                      {swatchImage ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-base-300 group">
                          <img
                            src={swatchImage}
                            alt={`${color.label}-swatch`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSwatchImage(color.label)}
                            className="absolute top-1 right-1 btn btn-circle btn-error btn-xs opacity-90 hover:opacity-100"
                            title="Remove swatch"
                          >
                            <LuX className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-20 w-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-base-content/30 bg-base-200/50 hover:bg-base-200 transition text-xs text-base-content/70">
                          {isSwatchUploading ? (
                            <LuLoader className="size-5 animate-spin text-primary" />
                          ) : (
                            <>
                              <LuPlus className="size-5 text-primary mb-1" />
                              <span>Upload Swatch</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isSwatchUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleSwatchUpload(color.label, file);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">
                          Color Image Gallery ({gallery.length})
                        </span>
                        {isGalleryUploading && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <LuLoader className="size-3 animate-spin" />{" "}
                            Uploading...
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {gallery.map((src, imgIdx) => (
                          <div
                            key={`${color.label}-gal-${imgIdx}`}
                            className="relative aspect-square rounded-lg overflow-hidden border border-base-300"
                          >
                            <img
                              src={src}
                              alt={`${color.label} view ${imgIdx}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeGalleryImage(color.label, imgIdx)
                              }
                              className="absolute top-1 right-1 btn btn-circle btn-error btn-xs size-5 p-0"
                            >
                              <LuX className="size-2.5" />
                            </button>
                          </div>
                        ))}

                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-base-content/30 bg-base-200/50 hover:bg-base-200 transition text-xs text-base-content/60">
                          <LuPlus className="size-5 text-primary mb-0.5" />
                          <span className="text-[10px]">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={isGalleryUploading}
                            onChange={(e) =>
                              handleGalleryUpload(color.label, e.target.files)
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Sizes & Pricing Actions */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold block">
                          Available Sizes for {color.label}{" "}
                          <span className="opacity-60 font-normal">
                            (Optional)
                          </span>
                        </label>
                        {colorSizes.length === 0 && (
                          <span className="text-[11px] text-primary font-medium">
                            No size needed? Set price & stock below!
                          </span>
                        )}
                      </div>
                      <CreatableSelect
                        value={colorSizes}
                        onChange={(value) =>
                          handleSizeChange(color.label, value)
                        }
                        onCreateOption={(input) =>
                          handleCreateSize(color.label, input)
                        }
                        options={sizeOptions}
                        isMulti
                        isLoading={isLoadingOptions}
                        placeholder="Leave blank for color-only, or select sizes (e.g. S, M, L)..."
                        className="text-sm"
                      />
                    </div>

                    {/* Case 1: Color Only (No Sizes Selected) */}
                    {colorSizes.length === 0 && (
                      <div className="bg-base-200/50 p-4 rounded-xl border border-base-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs bg-base-100 px-2.5 py-1 rounded-md border border-base-300">
                            Pricing & Stock for {color.label} (Color-Only Variation)
                          </span>
                          <span className="badge badge-sm badge-ghost text-xs">
                            Single Variant
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold block text-base-content/70">
                              Regular Price*
                            </label>
                            <input
                              type="number"
                              className="input input-sm w-full bg-base-100 mt-0.5"
                              placeholder="1000"
                              {...register(
                                `variantDetails.${colorIndex}.price`,
                                { required: "Required" },
                              )}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold block text-base-content/70">
                              Sale Price
                            </label>
                            <input
                              type="number"
                              className="input input-sm w-full bg-base-100 mt-0.5"
                              placeholder="900"
                              {...register(
                                `variantDetails.${colorIndex}.discount`,
                              )}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold block text-base-content/70">
                              Stock Qty*
                            </label>
                            <input
                              type="number"
                              className="input input-sm w-full bg-base-100 mt-0.5"
                              placeholder="10"
                              {...register(
                                `variantDetails.${colorIndex}.stock`,
                                {
                                  required: "Required",
                                  setValueAs: (v) =>
                                    v === "" || v === undefined
                                      ? ""
                                      : Number(v),
                                },
                              )}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold block text-base-content/70">
                              SKU (Opt)
                            </label>
                            <input
                              type="text"
                              className="input input-sm w-full bg-base-100 mt-0.5"
                              placeholder="SKU-01"
                              {...register(
                                `variantDetails.${colorIndex}.sku`,
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Case 2: Matrix with Sizes */}
                    {colorSizes.length > 0 && (
                      <>
                        {/* Bulk Action Toolbar */}
                        <div className="bg-base-200/70 p-3 rounded-xl border border-base-300">
                          <div className="flex items-center gap-1 text-xs font-bold text-primary mb-2">
                            <LuSparkles className="size-3.5" />
                            <span>Quick Bulk Fill for {color.label}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div>
                              <input
                                type="number"
                                placeholder="Reg Price"
                                className="input input-xs w-full bg-base-100"
                                onChange={(e) =>
                                  handleBulkChange(
                                    color.label,
                                    "price",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                placeholder="Sale Price"
                                className="input input-xs w-full bg-base-100"
                                onChange={(e) =>
                                  handleBulkChange(
                                    color.label,
                                    "discount",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                placeholder="Stock"
                                className="input input-xs w-full bg-base-100"
                                onChange={(e) =>
                                  handleBulkChange(
                                    color.label,
                                    "stock",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  applyBulkToSizes(color.label, colorIndex)
                                }
                                className="btn btn-xs btn-primary w-full"
                              >
                                Apply All
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Individual Size Rows */}
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                          {colorSizes.map((size, sizeIndex) => (
                            <div
                              key={size.label}
                              className="bg-base-200/50 p-3 rounded-xl border border-base-300/70"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-xs bg-base-100 px-2.5 py-1 rounded-md border border-base-300">
                                  Size: {size.label}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div>
                                  <label className="text-[11px] font-semibold block text-base-content/70">
                                    Regular Price*
                                  </label>
                                  <input
                                    type="number"
                                    className="input input-sm w-full bg-base-100 mt-0.5"
                                    placeholder="1000"
                                    {...register(
                                      `variantDetails.${colorIndex}.sizes.${sizeIndex}.price`,
                                      { required: "Required" },
                                    )}
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold block text-base-content/70">
                                    Sale Price
                                  </label>
                                  <input
                                    type="number"
                                    className="input input-sm w-full bg-base-100 mt-0.5"
                                    placeholder="900"
                                    {...register(
                                      `variantDetails.${colorIndex}.sizes.${sizeIndex}.discount`,
                                    )}
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold block text-base-content/70">
                                    Stock Qty*
                                  </label>
                                  <input
                                    type="number"
                                    className="input input-sm w-full bg-base-100 mt-0.5"
                                    placeholder="10"
                                    {...register(
                                      `variantDetails.${colorIndex}.sizes.${sizeIndex}.stock`,
                                      {
                                        required: "Required",
                                        setValueAs: (v) =>
                                          v === "" || v === undefined
                                            ? ""
                                            : Number(v),
                                      },
                                    )}
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold block text-base-content/70">
                                    SKU (Opt)
                                  </label>
                                  <input
                                    type="text"
                                    className="input input-sm w-full bg-base-100 mt-0.5"
                                    placeholder="SKU-01"
                                    {...register(
                                      `variantDetails.${colorIndex}.sizes.${sizeIndex}.sku`,
                                    )}
                                  />
                                </div>
                              </div>

                              <input
                                type="hidden"
                                value={size.label}
                                {...register(
                                  `variantDetails.${colorIndex}.sizes.${sizeIndex}.size`,
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Variations;
