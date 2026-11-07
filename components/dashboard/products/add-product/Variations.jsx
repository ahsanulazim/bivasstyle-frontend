"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAllAttribute, updateAttribute } from "@/api/attributeApi";
import { getAllVariations } from "@/api/typeApi";
import { uploadProductImages } from "@/api/productApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreatableSelect from "react-select/creatable";
import {
  LuPlus,
  LuX,
  LuSparkles,
  LuLoader,
  LuPalette,
  LuLayers,
  LuSlidersHorizontal,
  LuCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";
import Link from "next/link";

const Variations = ({
  register,
  setValue,
  getValues,
  errors,
  initialVariants,
}) => {
  const queryClient = useQueryClient();

  // 1. Fetch all attributes from DB (single source of truth)
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

  // Active attributes added to this product:
  // Array of { slug, name, type, values: [{ label, value, swatchImage?, hex? }] }
  const [productAttributes, setProductAttributes] = useState([]);

  // For Color-specific metadata (swatches and galleries per color)
  const [colorMeta, setColorMeta] = useState({});
  const [uploadingMeta, setUploadingMeta] = useState({});

  // Bulk input states
  const [bulkInputs, setBulkInputs] = useState({});
  const [singleAttrBulk, setSingleAttrBulk] = useState({
    price: "",
    discount: "",
    stock: "",
    skuPrefix: "",
  });

  const initializedRef = useRef(false);

  // Mutation to persist on-the-fly created attribute values to DB
  const updateAttrMutation = useMutation({
    mutationFn: updateAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  // Helper to normalize options from an attribute in DB
  const getOptionsForAttribute = (attr) => {
    if (!attr) return [];
    const fromAttr = (attr.variations || []).map((item, idx) => {
      if (typeof item === "string") {
        return {
          id: `${attr.slug}-${idx}`,
          label: item,
          value: item,
          swatchImage: null,
        };
      }
      return {
        id: item._id || `${attr.slug}-${idx}`,
        label: item.name || item.value,
        value: item.value || item.name,
        swatchImage: item.image ?? item.swatchImage ?? null,
      };
    });

    const fromLegacy = (variations || [])
      .filter((v) => v.attributeSlug === attr.slug)
      .map((item) => ({
        id: item._id,
        label: item.name,
        value: item.value,
        swatchImage: item.image ?? item.swatchImage ?? null,
      }));

    const combined = [...fromAttr];
    for (const v of fromLegacy) {
      if (
        !combined.some(
          (c) => c.label.toLowerCase() === v.label.toLowerCase(),
        )
      ) {
        combined.push(v);
      }
    }
    return combined;
  };

  // Check which attributes are already added to this product
  const addedSlugs = useMemo(
    () => new Set(productAttributes.map((a) => a.slug)),
    [productAttributes],
  );

  const availableAttributes = useMemo(
    () => (attributes || []).filter((a) => !addedSlugs.has(a.slug)),
    [attributes, addedSlugs],
  );

  // Determine if "Color" is one of the selected product attributes
  const colorAttr = useMemo(
    () =>
      productAttributes.find(
        (a) =>
          a.slug === "color" ||
          a.type === "color" ||
          a.name?.toLowerCase() === "color",
      ),
    [productAttributes],
  );

  // Determine other non-color attributes (e.g. Size, Material, etc.)
  const secondaryAttrs = useMemo(
    () =>
      productAttributes.filter(
        (a) =>
          a.slug !== "color" &&
          a.type !== "color" &&
          a.name?.toLowerCase() !== "color",
      ),
    [productAttributes],
  );

  // Auto-initialize when editing an existing product (initialVariants)
  useEffect(() => {
    if (
      !initializedRef.current &&
      Array.isArray(initialVariants) &&
      initialVariants.length > 0 &&
      attributes.length > 0
    ) {
      const detectedAttrs = [];

      // Check for Color
      const hasColors = initialVariants.some((v) => Boolean(v.color));
      if (hasColors) {
        const matchingColorAttr = attributes.find(
          (a) =>
            a.slug === "color" ||
            a.type === "color" ||
            a.name?.toLowerCase() === "color",
        );
        const uniqueColors = [];
        const meta = {};

        initialVariants.forEach((v) => {
          if (v.color && !uniqueColors.some((c) => c.label === v.color)) {
            uniqueColors.push({
              label: v.color,
              value: v.hex || "#000000",
              swatchImage: v.swatchImage || null,
            });
          }
          if (v.color) {
            meta[v.color] = {
              swatchImage: v.swatchImage || null,
              imageGallery: v.imageGallery || [],
            };
          }
        });

        detectedAttrs.push({
          slug: matchingColorAttr?.slug || "color",
          name: matchingColorAttr?.name || "Color",
          type: "color",
          values: uniqueColors,
        });

        setColorMeta(meta);
      }

      // Check for nested sizes (under color)
      const hasNestedSizes = initialVariants.some(
        (v) => Array.isArray(v.sizes) && v.sizes.length > 0,
      );
      if (hasNestedSizes) {
        const matchingSizeAttr = attributes.find(
          (a) =>
            a.slug === "size" ||
            a.type === "button" ||
            a.name?.toLowerCase() === "size",
        );
        const uniqueSizes = [];
        initialVariants.forEach((v) => {
          (v.sizes || []).forEach((s) => {
            if (s.size && !uniqueSizes.some((u) => u.label === s.size)) {
              uniqueSizes.push({ label: s.size, value: s.size });
            }
          });
        });

        detectedAttrs.push({
          slug: matchingSizeAttr?.slug || "size",
          name: matchingSizeAttr?.name || "Size",
          type: matchingSizeAttr?.type || "button",
          values: uniqueSizes,
        });
      }

      // Check for direct size (Size Only, no color)
      const hasDirectSize =
        !hasColors && initialVariants.some((v) => Boolean(v.size));
      if (hasDirectSize) {
        const matchingSizeAttr = attributes.find(
          (a) =>
            a.slug === "size" ||
            a.type === "button" ||
            a.name?.toLowerCase() === "size",
        );
        const uniqueSizes = [];
        initialVariants.forEach((v) => {
          if (v.size && !uniqueSizes.some((u) => u.label === v.size)) {
            uniqueSizes.push({ label: v.size, value: v.size });
          }
        });

        detectedAttrs.push({
          slug: matchingSizeAttr?.slug || "size",
          name: matchingSizeAttr?.name || "Size",
          type: matchingSizeAttr?.type || "button",
          values: uniqueSizes,
        });
      }

      // Check for custom attribute (e.g. Material)
      const hasCustom = initialVariants.some((v) =>
        Boolean(v.attributeName || v.attributeValue),
      );
      if (hasCustom && !hasColors && !hasDirectSize) {
        const attrName = initialVariants[0]?.attributeName || "Material";
        const matchingAttr = attributes.find(
          (a) => a.name?.toLowerCase() === attrName.toLowerCase(),
        );
        const uniqueTerms = [];
        initialVariants.forEach((v) => {
          const val = v.attributeValue || v.name;
          if (val && !uniqueTerms.some((u) => u.label === val)) {
            uniqueTerms.push({ label: val, value: val });
          }
        });

        detectedAttrs.push({
          slug: matchingAttr?.slug || attrName.toLowerCase().replace(/\s+/g, "-"),
          name: attrName,
          type: matchingAttr?.type || "button",
          values: uniqueTerms,
        });
      }

      if (detectedAttrs.length > 0) {
        setProductAttributes(detectedAttrs);
        setValue("variantDetails", initialVariants, { shouldDirty: false });
        initialVariants.forEach((v, idx) => {
          if (v.price !== undefined) setValue(`variantDetails.${idx}.price`, v.price);
          if (v.discount !== undefined) setValue(`variantDetails.${idx}.discount`, v.discount);
          if (v.stock !== undefined) setValue(`variantDetails.${idx}.stock`, v.stock);
          if (v.sku !== undefined) setValue(`variantDetails.${idx}.sku`, v.sku);
          if (v.size !== undefined) setValue(`variantDetails.${idx}.size`, v.size);
          if (v.attributeName !== undefined) setValue(`variantDetails.${idx}.attributeName`, v.attributeName);
          if (v.attributeValue !== undefined) setValue(`variantDetails.${idx}.attributeValue`, v.attributeValue);
          if (Array.isArray(v.sizes)) {
            v.sizes.forEach((s, sIdx) => {
              if (s.price !== undefined) setValue(`variantDetails.${idx}.sizes.${sIdx}.price`, s.price);
              if (s.discount !== undefined) setValue(`variantDetails.${idx}.sizes.${sIdx}.discount`, s.discount);
              if (s.stock !== undefined) setValue(`variantDetails.${idx}.sizes.${sIdx}.stock`, s.stock);
              if (s.sku !== undefined) setValue(`variantDetails.${idx}.sizes.${sIdx}.sku`, s.sku);
              setValue(`variantDetails.${idx}.sizes.${sIdx}.size`, s.size);
            });
          }
        });
        initializedRef.current = true;
      }
    }
  }, [initialVariants, attributes, setValue]);

  // Add an attribute to this product
  const handleAddAttribute = (attr) => {
    if (!attr || addedSlugs.has(attr.slug)) return;
    setProductAttributes((prev) => [
      ...prev,
      {
        slug: attr.slug,
        name: attr.name,
        type: attr.type || (attr.slug === "color" ? "color" : "button"),
        values: [],
      },
    ]);
    toast.success(`"${attr.name}" added to product attributes`);
  };

  // Remove an attribute from this product
  const handleRemoveAttribute = (slugToRemove) => {
    setProductAttributes((prev) =>
      prev.filter((a) => a.slug !== slugToRemove),
    );
    toast.info("Attribute removed");
  };

  // Update selected values for an attribute
  const handleAttributeValuesChange = (slug, newValues) => {
    setProductAttributes((prev) =>
      prev.map((attr) =>
        attr.slug === slug ? { ...attr, values: newValues || [] } : attr,
      ),
    );
  };

  // Create on-the-fly value for an attribute and save to DB
  const handleCreateValueForAttribute = (slug, inputValue) => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const targetAttr = productAttributes.find((a) => a.slug === slug);
    if (!targetAttr) return;

    const newValue = {
      label: trimmed,
      value: trimmed,
      swatchImage: null,
    };

    handleAttributeValuesChange(slug, [...targetAttr.values, newValue]);

    // Save to DB attribute collection
    const dbAttr = attributes.find((a) => a.slug === slug);
    if (dbAttr && dbAttr._id) {
      const currentVars = Array.isArray(dbAttr.variations)
        ? dbAttr.variations
        : [];
      updateAttrMutation.mutate({
        id: dbAttr._id,
        attributeData: {
          ...dbAttr,
          variations: [...currentVars, { name: trimmed, value: trimmed }],
        },
      });
      toast.success(`"${trimmed}" saved to ${dbAttr.name} attribute`);
    }
  };

  // Select all values defined in DB for an attribute
  const handleSelectAllValues = (slug) => {
    const dbAttr = attributes.find((a) => a.slug === slug);
    if (!dbAttr) return;
    const allOptions = getOptionsForAttribute(dbAttr);
    handleAttributeValuesChange(slug, allOptions);
  };

  /* ------------------------------------------------------------- */
  /* COLOR MEDIA UPLOAD HANDLERS                                   */
  /* ------------------------------------------------------------- */
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

  /* ------------------------------------------------------------- */
  /* BULK ACTIONS                                                  */
  /* ------------------------------------------------------------- */
  const handleBulkChangeForColor = (colorLabel, field, value) => {
    setBulkInputs((prev) => ({
      ...prev,
      [colorLabel]: {
        ...(prev[colorLabel] || {}),
        [field]: value,
      },
    }));
  };

  const applyBulkToColorSubVariants = (colorLabel, colorIndex, subValues) => {
    const bulk = bulkInputs[colorLabel] || {};
    if (!subValues?.length) {
      toast.info("Please select variation values first");
      return;
    }

    subValues.forEach((_, sizeIndex) => {
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
          `${bulk.skuPrefix}-${subValues[sizeIndex].label}`,
          { shouldDirty: true },
        );
      }
    });

    toast.success(
      `Applied values to all ${subValues.length} items in ${colorLabel}!`,
    );
  };

  const applySingleAttributeBulk = (items) => {
    if (!items?.length) {
      toast.info("Please select variation values first");
      return;
    }

    items.forEach((item, idx) => {
      if (singleAttrBulk.price !== "") {
        setValue(`variantDetails.${idx}.price`, singleAttrBulk.price, {
          shouldDirty: true,
        });
      }
      if (singleAttrBulk.discount !== "") {
        setValue(`variantDetails.${idx}.discount`, singleAttrBulk.discount, {
          shouldDirty: true,
        });
      }
      if (singleAttrBulk.stock !== "") {
        setValue(`variantDetails.${idx}.stock`, singleAttrBulk.stock, {
          shouldDirty: true,
        });
      }
      if (singleAttrBulk.skuPrefix) {
        setValue(
          `variantDetails.${idx}.sku`,
          `${singleAttrBulk.skuPrefix}-${item.label}`,
          { shouldDirty: true },
        );
      }
    });

    toast.success(`Applied bulk values to all ${items.length} items!`);
  };

  /* ------------------------------------------------------------- */
  /* FORM VALUE SYNCHRONIZATION                                    */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    if (productAttributes.length === 0 && !initializedRef.current) {
      setValue("variantDetails", [], { shouldDirty: true });
      return;
    }

    const previous = getValues("variantDetails") || [];

    // CASE 1: Color attribute is present
    if (colorAttr && colorAttr.values.length > 0) {
      const selectedColors = colorAttr.values;
      const primarySubAttr = secondaryAttrs[0]; // e.g. Size or Material
      const subValues = primarySubAttr?.values || [];

      const nextVariants = selectedColors.map((color, colorIdx) => {
        const previousColor = previous.find((p) => p.color === color.label);

        const colorPrice = getValues(`variantDetails.${colorIdx}.price`);
        const colorDiscount = getValues(`variantDetails.${colorIdx}.discount`);
        const colorStock = getValues(`variantDetails.${colorIdx}.stock`);
        const colorSku = getValues(`variantDetails.${colorIdx}.sku`);

        const sizes = subValues.map((sub, subIdx) => {
          const formPrice = getValues(
            `variantDetails.${colorIdx}.sizes.${subIdx}.price`,
          );
          const formDiscount = getValues(
            `variantDetails.${colorIdx}.sizes.${subIdx}.discount`,
          );
          const formStock = getValues(
            `variantDetails.${colorIdx}.sizes.${subIdx}.stock`,
          );
          const formSku = getValues(
            `variantDetails.${colorIdx}.sizes.${subIdx}.sku`,
          );

          const previousSub = previousColor?.sizes?.find(
            (s) => s.size === sub.label,
          );

          return {
            size: sub.label,
            price:
              formPrice !== undefined && formPrice !== ""
                ? formPrice
                : (previousSub?.price ?? ""),
            discount:
              formDiscount !== undefined && formDiscount !== ""
                ? formDiscount
                : (previousSub?.discount ?? ""),
            stock:
              formStock !== undefined && formStock !== ""
                ? formStock
                : (previousSub?.stock ?? ""),
            sku:
              formSku !== undefined && formSku !== ""
                ? formSku
                : (previousSub?.sku ?? ""),
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
            colorPrice !== undefined && colorPrice !== ""
              ? colorPrice
              : (previousColor?.price ?? ""),
          discount:
            colorDiscount !== undefined && colorDiscount !== ""
              ? colorDiscount
              : (previousColor?.discount ?? ""),
          stock:
            colorStock !== undefined && colorStock !== ""
              ? colorStock
              : (previousColor?.stock ?? ""),
          sku:
            colorSku !== undefined && colorSku !== ""
              ? colorSku
              : (previousColor?.sku ?? ""),
          sizes,
        };
      });

      setValue("variantDetails", nextVariants, {
        shouldValidate: false,
        shouldDirty: true,
      });
      return;
    }

    // CASE 2: No Color attribute (e.g. Size Only, Material Only, etc.)
    if (!colorAttr && secondaryAttrs.length > 0) {
      const primaryAttr = secondaryAttrs[0];
      const items = primaryAttr.values || [];
      const isSize =
        primaryAttr.slug === "size" ||
        primaryAttr.name?.toLowerCase() === "size";

      const nextVariants = items.map((item, idx) => {
        const prevItem = previous.find(
          (p) =>
            p.size === item.label ||
            p.attributeValue === item.label ||
            p.name === item.label,
        );

        const formPrice = getValues(`variantDetails.${idx}.price`);
        const formDiscount = getValues(`variantDetails.${idx}.discount`);
        const formStock = getValues(`variantDetails.${idx}.stock`);
        const formSku = getValues(`variantDetails.${idx}.sku`);

        if (isSize) {
          return {
            size: item.label,
            name: item.label,
            price:
              formPrice !== undefined && formPrice !== ""
                ? formPrice
                : (prevItem?.price ?? ""),
            discount:
              formDiscount !== undefined && formDiscount !== ""
                ? formDiscount
                : (prevItem?.discount ?? ""),
            stock:
              formStock !== undefined && formStock !== ""
                ? formStock
                : (prevItem?.stock ?? ""),
            sku:
              formSku !== undefined && formSku !== ""
                ? formSku
                : (prevItem?.sku ?? ""),
            sizes: [],
          };
        }

        return {
          attributeName: primaryAttr.name,
          attributeValue: item.label,
          name: item.label,
          price:
            formPrice !== undefined && formPrice !== ""
              ? formPrice
              : (prevItem?.price ?? ""),
          discount:
            formDiscount !== undefined && formDiscount !== ""
              ? formDiscount
              : (prevItem?.discount ?? ""),
          stock:
            formStock !== undefined && formStock !== ""
              ? formStock
              : (prevItem?.stock ?? ""),
          sku:
            formSku !== undefined && formSku !== ""
              ? formSku
              : (prevItem?.sku ?? ""),
          sizes: [],
        };
      });

      setValue("variantDetails", nextVariants, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [
    productAttributes,
    colorAttr,
    secondaryAttrs,
    colorMeta,
    getValues,
    setValue,
  ]);

  return (
    <div className="fieldset bg-base-100 p-5 rounded-2xl mt-5 border border-base-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200 pb-4">
        <div>
          <h2 className="font-bold text-xl flex items-center gap-2">
            <LuSlidersHorizontal className="text-primary size-5" />
            Product Variation Attributes
          </h2>
          <p className="text-xs text-base-content/60 mt-0.5">
            Select which attributes define variations for this product from your
            stored attributes. You have complete freedom to choose Color, Size,
            Material, or any combination.
          </p>
        </div>
        <Link
          href="/dashboard/attributes"
          target="_blank"
          className="btn btn-ghost btn-xs text-primary gap-1 self-start sm:self-auto"
          title="Manage system attributes"
        >
          <LuSlidersHorizontal className="size-3" /> Manage Attributes
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: ATTRIBUTE SELECTION (From added attributes in DB)     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-base-200/50 p-4 rounded-xl border border-base-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-base-content/80 uppercase tracking-wide">
            Step 1: Add Attributes to this Product
          </label>
          <span className="text-xs text-base-content/60">
            {productAttributes.length} attribute(s) active
          </span>
        </div>

        {/* Attribute Pills to Add */}
        {availableAttributes.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-base-content/60 font-medium">
              Available Attributes:
            </span>
            {availableAttributes.map((attr) => (
              <button
                key={attr.slug}
                type="button"
                onClick={() => handleAddAttribute(attr)}
                className="btn btn-xs btn-outline hover:btn-primary gap-1 rounded-lg"
              >
                <LuPlus className="size-3" />
                <span>{attr.name}</span>
                <span className="badge badge-xs badge-ghost text-[10px] opacity-70">
                  {attr.variations?.length || 0}
                </span>
              </button>
            ))}
          </div>
        ) : attributes.length === 0 ? (
          <div className="p-3 bg-base-100 rounded-lg border border-base-300 text-xs text-base-content/70 flex items-center justify-between">
            <span>No attributes found in system yet.</span>
            <Link
              href="/dashboard/attributes"
              className="btn btn-xs btn-primary"
            >
              Create Attributes
            </Link>
          </div>
        ) : (
          <p className="text-xs text-success flex items-center gap-1 font-medium">
            <LuCheck className="size-3.5" /> All available system attributes
            have been added.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE ATTRIBUTE VALUE SELECTORS                              */}
      {/* ------------------------------------------------------------- */}
      {productAttributes.length > 0 ? (
        <div className="space-y-4">
          <label className="text-xs font-bold text-base-content/80 uppercase tracking-wide block">
            Step 2: Choose Values for Each Added Attribute
          </label>

          <div className="grid gap-3">
            {productAttributes.map((attr) => {
              const dbAttr = attributes.find((a) => a.slug === attr.slug);
              const options = getOptionsForAttribute(dbAttr);
              const isColor = attr.type === "color" || attr.slug === "color";

              return (
                <div
                  key={attr.slug}
                  className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-base-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-base-content">
                        {attr.name}
                      </span>
                      <span className="badge badge-sm badge-neutral text-xs">
                        {isColor ? "Color Swatch" : "Button/Option"}
                      </span>
                      <span className="text-xs text-base-content/50">
                        ({attr.values?.length || 0} selected)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllValues(attr.slug)}
                        className="btn btn-ghost btn-xs text-primary"
                        title="Select all pre-configured values from DB"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attr.slug)}
                        className="btn btn-ghost btn-circle btn-xs text-error"
                        title={`Remove ${attr.name} attribute`}
                      >
                        <LuX className="size-4" />
                      </button>
                    </div>
                  </div>

                  <CreatableSelect
                    value={attr.values}
                    onChange={(val) =>
                      handleAttributeValuesChange(attr.slug, val)
                    }
                    onCreateOption={(input) =>
                      handleCreateValueForAttribute(attr.slug, input)
                    }
                    options={options}
                    isMulti
                    isLoading={isLoadingOptions}
                    placeholder={`Select ${attr.name} values or type new and press Enter...`}
                    className="text-sm"
                    formatOptionLabel={(option) => {
                      const isColorValue =
                        isColor &&
                        typeof option.value === "string" &&
                        (option.value.startsWith("#") ||
                          option.value.startsWith("rgb"));
                      return (
                        <div className="flex items-center gap-2">
                          {isColor && (
                            <span
                              className="size-3.5 rounded-full border border-black/15 shadow-2xs inline-block shrink-0"
                              style={{
                                backgroundColor: isColorValue
                                  ? option.value
                                  : "#000000",
                              }}
                            />
                          )}
                          <span className="font-medium">{option.label}</span>
                          {isColorValue && (
                            <span className="text-[10px] opacity-40 font-mono">
                              {option.value}
                            </span>
                          )}
                        </div>
                      );
                    }}
                  />
                  <span className="text-[10px] text-base-content/50 block">
                    Choose from {attr.name} options in your store, or type a new
                    one and press Enter.
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed border-base-300 rounded-2xl bg-base-100">
          <LuSlidersHorizontal className="size-8 text-base-content/40 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-base-content">
            No Attributes Selected Yet
          </h4>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
            Click on any of the available attributes above (e.g. Size, Color,
            Material) to enable variations for this product.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: VARIATION PRICING & INVENTORY CONFIGURATION          */}
      {/* ------------------------------------------------------------- */}

      {/* ============================================================= */}
      {/* CASE A: COLOR IS PRESENT (With or without Size / sub-attributes) */}
      {/* ============================================================= */}
      {colorAttr && colorAttr.values.length > 0 && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-base-200 pb-2">
            <label className="text-xs font-bold text-base-content/80 uppercase tracking-wide">
              Step 3: Configure Pricing & Stock for Color Variants (
              {colorAttr.values.length} Color(s))
            </label>
            {secondaryAttrs.length > 0 && (
              <span className="badge badge-sm badge-primary badge-outline">
                {colorAttr.name} & {secondaryAttrs[0].name} Combination
              </span>
            )}
          </div>

          <div className="space-y-6">
            {colorAttr.values.map((color, colorIndex) => {
              const gallery = colorMeta[color.label]?.imageGallery ?? [];
              const swatchImage = colorMeta[color.label]?.swatchImage ?? null;
              const isSwatchUploading = uploadingMeta[`${color.label}-swatch`];
              const isGalleryUploading = uploadingMeta[`${color.label}-gallery`];

              const primarySubAttr = secondaryAttrs[0];
              const subValues = primarySubAttr?.values || [];

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
                            handleAttributeValuesChange(
                              colorAttr.slug,
                              colorAttr.values.map((c) =>
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
                        subValues.length > 0
                          ? "badge-neutral"
                          : "badge-primary badge-outline"
                      }`}
                    >
                      {subValues.length > 0
                        ? `${subValues.length} ${primarySubAttr.name}(s)`
                        : "Color Only"}
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

                    {/* Right Column: Pricing & Stock */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Sub-variant Matrix (when Size or other sub-attribute is present) */}
                      {subValues.length > 0 ? (
                        <>
                          {/* Bulk Toolbar per Color */}
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
                                    handleBulkChangeForColor(
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
                                    handleBulkChangeForColor(
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
                                    handleBulkChangeForColor(
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
                                    applyBulkToColorSubVariants(
                                      color.label,
                                      colorIndex,
                                      subValues,
                                    )
                                  }
                                  className="btn btn-xs btn-primary w-full"
                                >
                                  Apply All
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Individual Sub-Variant Rows */}
                          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                            {subValues.map((sub, subIndex) => (
                              <div
                                key={sub.label}
                                className="bg-base-200/50 p-3 rounded-xl border border-base-300/70"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-xs bg-base-100 px-2.5 py-1 rounded-md border border-base-300">
                                    {primarySubAttr.name}: {sub.label}
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
                                        `variantDetails.${colorIndex}.sizes.${subIndex}.price`,
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
                                        `variantDetails.${colorIndex}.sizes.${subIndex}.discount`,
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
                                        `variantDetails.${colorIndex}.sizes.${subIndex}.stock`,
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
                                        `variantDetails.${colorIndex}.sizes.${subIndex}.sku`,
                                      )}
                                    />
                                  </div>
                                </div>

                                <input
                                  type="hidden"
                                  value={sub.label}
                                  {...register(
                                    `variantDetails.${colorIndex}.sizes.${subIndex}.size`,
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        /* Color Only Pricing (No sub-attribute) */
                        <div className="bg-base-200/50 p-4 rounded-xl border border-base-300 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs bg-base-100 px-2.5 py-1 rounded-md border border-base-300">
                              Pricing & Stock for {color.label} (Color-Only
                              Variation)
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* CASE B: NO COLOR ATTRIBUTE (Single Attribute, e.g. Size Only, Material Only) */}
      {/* ============================================================= */}
      {!colorAttr &&
        secondaryAttrs.length > 0 &&
        secondaryAttrs[0].values.length > 0 && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between border-b border-base-200 pb-2">
              <label className="text-xs font-bold text-base-content/80 uppercase tracking-wide">
                Step 3: Set Price & Stock for {secondaryAttrs[0].name} Variants
                ({secondaryAttrs[0].values.length} option(s))
              </label>
              <span className="badge badge-sm badge-neutral">
                {secondaryAttrs[0].name} Only (No Color)
              </span>
            </div>

            {/* Quick Bulk Toolbar */}
            <div className="bg-base-200/70 p-3.5 rounded-xl border border-base-300">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                <LuSparkles className="size-3.5" />
                <span>
                  Quick Bulk Fill for All {secondaryAttrs[0].name} Options
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input
                  type="number"
                  placeholder="Regular Price"
                  className="input input-sm w-full bg-base-100"
                  value={singleAttrBulk.price}
                  onChange={(e) =>
                    setSingleAttrBulk((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Sale Price"
                  className="input input-sm w-full bg-base-100"
                  value={singleAttrBulk.discount}
                  onChange={(e) =>
                    setSingleAttrBulk((prev) => ({
                      ...prev,
                      discount: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Stock Qty"
                  className="input input-sm w-full bg-base-100"
                  value={singleAttrBulk.stock}
                  onChange={(e) =>
                    setSingleAttrBulk((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="SKU Prefix"
                  className="input input-sm w-full bg-base-100"
                  value={singleAttrBulk.skuPrefix}
                  onChange={(e) =>
                    setSingleAttrBulk((prev) => ({
                      ...prev,
                      skuPrefix: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    applySingleAttributeBulk(secondaryAttrs[0].values)
                  }
                  className="btn btn-sm btn-primary w-full col-span-2 sm:col-span-1"
                >
                  Apply All
                </button>
              </div>
            </div>

            {/* Variant Rows List */}
            <div className="grid gap-2.5">
              {secondaryAttrs[0].values.map((item, idx) => {
                const isSize =
                  secondaryAttrs[0].slug === "size" ||
                  secondaryAttrs[0].name?.toLowerCase() === "size";

                return (
                  <div
                    key={item.label}
                    className="bg-base-200/50 p-3.5 rounded-xl border border-base-300 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="badge badge-neutral font-bold text-xs px-3 py-2.5">
                        {secondaryAttrs[0].name}: {item.label}
                      </span>
                      {isSize ? (
                        <input
                          type="hidden"
                          value={item.label}
                          {...register(`variantDetails.${idx}.size`)}
                        />
                      ) : (
                        <>
                          <input
                            type="hidden"
                            value={secondaryAttrs[0].name}
                            {...register(`variantDetails.${idx}.attributeName`)}
                          />
                          <input
                            type="hidden"
                            value={item.label}
                            {...register(`variantDetails.${idx}.attributeValue`)}
                          />
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 grow max-w-2xl">
                      <div>
                        <label className="text-[10px] font-semibold text-base-content/60 block mb-0.5">
                          Regular Price*
                        </label>
                        <input
                          type="number"
                          className="input input-sm w-full bg-base-100"
                          placeholder="1000"
                          {...register(`variantDetails.${idx}.price`, {
                            required: "Required",
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-base-content/60 block mb-0.5">
                          Sale Price
                        </label>
                        <input
                          type="number"
                          className="input input-sm w-full bg-base-100"
                          placeholder="900"
                          {...register(`variantDetails.${idx}.discount`)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-base-content/60 block mb-0.5">
                          Stock Qty*
                        </label>
                        <input
                          type="number"
                          className="input input-sm w-full bg-base-100"
                          placeholder="10"
                          {...register(`variantDetails.${idx}.stock`, {
                            required: "Required",
                            setValueAs: (v) =>
                              v === "" || v === undefined ? "" : Number(v),
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-base-content/60 block mb-0.5">
                          SKU (Opt)
                        </label>
                        <input
                          type="text"
                          className="input input-sm w-full bg-base-100"
                          placeholder="SKU-01"
                          {...register(`variantDetails.${idx}.sku`)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

export default Variations;