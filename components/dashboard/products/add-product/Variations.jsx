"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllVariations } from "@/api/typeApi";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { LuPlus, LuX } from "react-icons/lu";

const toOptions = (items) =>
  items?.map((item) => ({
    id: item._id,
    value: item.value,
    label: item.name,
    swatchImage: item.image ?? item.swatchImage ?? null,
  })) ?? [];

const Variations = ({
  register,
  setValue,
  getValues,
  errors,
  initialVariants,
}) => {
  const { data: variations, isLoading: variationsLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: getAllVariations,
  });

  const colorOptions = useMemo(
    () =>
      toOptions(
        variations?.filter((variation) => variation.attributeSlug === "color"),
      ),
    [variations],
  );

  const sizeOptions = useMemo(
    () =>
      toOptions(
        variations?.filter((variation) => variation.attributeSlug === "size"),
      ),
    [variations],
  );

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizesByColor, setSelectedSizesByColor] = useState({});
  const [colorMeta, setColorMeta] = useState({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (
      !initialized &&
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
      setValue("variantDetails", initialVariants);
      setInitialized(true);
    }
  }, [initialVariants, initialized, setValue]);

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
          swatchImage: null,
          imageGallery: [],
        };
      });
      return next;
    });
  };

  const handleSizeChange = (colorLabel, sizes) => {
    setSelectedSizesByColor((previous) => ({
      ...previous,
      [colorLabel]: normalizeOptions(sizes),
    }));
  };

  const handleSwatchUpload = (colorLabel, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setColorMeta((previous) => ({
        ...previous,
        [colorLabel]: {
          ...previous[colorLabel],
          swatchImage: event.target.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (colorLabel, files) => {
    const fileArray = Array.from(files || []);
    if (!fileArray.length) return;

    Promise.all(
      fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newImages) => {
      setColorMeta((previous) => ({
        ...previous,
        [colorLabel]: {
          ...previous[colorLabel],
          imageGallery: [
            ...(previous[colorLabel]?.imageGallery ?? []),
            ...newImages,
          ],
        },
      }));
    });
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

  useEffect(() => {
    const previousVariantDetails = getValues("variantDetails") || [];

    const nextVariantDetails = selectedColors.map((color) => {
      const previousColor = Array.isArray(previousVariantDetails)
        ? previousVariantDetails.find((item) => item.color === color.label)
        : undefined;

      const sizes = (selectedSizesByColor[color.label] ?? []).map((size) => {
        const previousSize = previousColor?.sizes?.find(
          (item) => item.size === size.label,
        );

        return {
          size: size.label,
          stock: previousSize?.stock ?? "",
          price: previousSize?.price ?? "",
          discount: previousSize?.discount ?? "",
          sku: previousSize?.sku ?? "",
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
        sizes,
      };
    });

    setValue("variantDetails", nextVariantDetails, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedColors, selectedSizesByColor, colorMeta, getValues, setValue]);

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
      <h2 className="font-bold text-xl">Product Variants</h2>

      <label htmlFor="colors" className="label">
        Colors
      </label>
      <Select
        value={selectedColors}
        onChange={handleColorChange}
        options={colorOptions}
        isMulti
        isLoading={variationsLoading}
      />

      {selectedColors.length > 0 && (
        <div className="mt-6 bg-base-200 rounded-box p-4">
          <h3 className="font-semibold text-lg">Variant Details</h3>
          <p className="text-sm text-muted mb-4">
            Set swatch and gallery images for each selected color, then add
            sizes.
          </p>

          <div className="space-y-5">
            {selectedColors.map((color, colorIndex) => {
              const gallery = colorMeta[color.label]?.imageGallery ?? [];
              const swatchImage = colorMeta[color.label]?.swatchImage ?? null;

              return (
                <div
                  key={color.label}
                  className="border border-base-300 rounded-box p-4"
                >
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-medium">{color.label}</div>
                      <div className="text-sm text-muted">{color.value}</div>
                    </div>
                    <div
                      className="size-10 rounded-full"
                      style={{ backgroundColor: color.value }}
                    ></div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                    <div className="space-y-4">
                      <div>
                        <p className="label">Swatch Image</p>
                        {swatchImage ? (
                          <div className="relative w-28 h-28 rounded-box overflow-hidden border border-base-content/10">
                            <img
                              src={swatchImage}
                              alt={`${color.label}-swatch`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSwatchImage(color.label)}
                              className="absolute right-1 top-1 btn-circle btn btn-error btn-xs"
                            >
                              <LuX />
                            </button>
                          </div>
                        ) : (
                          <label className="group flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-box border border-dashed border-base-content/40 bg-base-100 text-center text-sm text-base-content/60 transition hover:border-main hover:text-main">
                            <span className="text-3xl">
                              <LuPlus />
                            </span>
                            <span>Add swatch</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSwatchUpload(color.label, file);
                              }}
                            />
                          </label>
                        )}
                      </div>

                      <div>
                        <label className="label">Image Gallery</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {gallery.map((src, imageIndex) => (
                            <div
                              key={`${color.label}-gallery-${imageIndex}`}
                              className="relative overflow-hidden rounded-box border border-base-content/10"
                            >
                              <img
                                src={src}
                                alt={`${color.label}-gallery-${imageIndex}`}
                                className="h-28 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeGalleryImage(color.label, imageIndex)
                                }
                                className="absolute right-1 top-1 btn-circle btn btn-error btn-xs"
                              >
                                <LuX />
                              </button>
                            </div>
                          ))}

                          <label className="group flex cursor-pointer h-28 min-h-28 flex-col items-center justify-center rounded-box border border-dashed border-base-content/40 bg-base-100 text-center text-sm text-base-content/60 transition hover:border-main hover:text-main">
                            <span className="text-3xl">
                              <LuPlus />
                            </span>
                            <span>Add images</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                handleGalleryUpload(
                                  color.label,
                                  e.target.files,
                                );
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="label">Sizes</label>
                      <Select
                        value={selectedSizesByColor[color.label] ?? []}
                        onChange={(value) =>
                          handleSizeChange(color.label, value)
                        }
                        options={sizeOptions}
                        isMulti
                        isLoading={variationsLoading}
                      />

                      {(selectedSizesByColor[color.label] ?? []).length > 0 && (
                        <div className="space-y-4">
                          {selectedSizesByColor[color.label].map(
                            (size, sizeIndex) => (
                              <div
                                key={size.label}
                                className="rounded-box border bg-base-300 border-base-300 p-4"
                              >
                                <div className="mb-2 font-medium">
                                  {size.label}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div>
                                    <label className="label">Price</label>
                                    <input
                                      type="number"
                                      className="input w-full"
                                      placeholder="1000"
                                      {...register(
                                        `variantDetails.${colorIndex}.sizes.${sizeIndex}.price`,
                                        {
                                          required: "Price is required",
                                        },
                                      )}
                                    />
                                    {errors.variantDetails?.[colorIndex]
                                      ?.sizes?.[sizeIndex]?.price && (
                                      <p className="text-red-600 text-sm">
                                        {
                                          errors.variantDetails[colorIndex]
                                            .sizes[sizeIndex].price.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="label">Discount</label>
                                    <input
                                      type="number"
                                      className="input w-full"
                                      placeholder="1000"
                                      {...register(
                                        `variantDetails.${colorIndex}.sizes.${sizeIndex}.discount`,
                                      )}
                                    />
                                  </div>

                                  <div>
                                    <label className="label">Stock</label>
                                    <input
                                      type="number"
                                      className="input w-full"
                                      placeholder="10"
                                      {...register(
                                        `variantDetails.${colorIndex}.sizes.${sizeIndex}.stock`,
                                        {
                                          setValueAs: (value) =>
                                            value === "" || value === undefined
                                              ? ""
                                              : Number(value),
                                        },
                                      )}
                                    />
                                  </div>

                                  <div>
                                    <label className="label">SKU</label>
                                    <input
                                      type="text"
                                      className="input w-full"
                                      placeholder="OPTIONAL SKU"
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
                            ),
                          )}
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
    </div>
  );
};

export default Variations;
