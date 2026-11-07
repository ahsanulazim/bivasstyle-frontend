"use client";

import { useState, useMemo, useContext, useRef, useEffect } from "react";
import ProductImages from "./ProductImages";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import { LuRuler } from "react-icons/lu";
import TrustBadges from "./TrustBadges";
import SizeGuideModal from "./SizeGuideModal";
import { MyContext } from "@/context/MyProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { trackFacebookEvent } from "@/lib/fpixel";

const ProductInteractiveLayer = ({ product }) => {
  const router = useRouter();
  const sizeGuideRef = useRef(null);

  const hasVariants = Boolean(
    product?.hasVariants !== false &&
      Array.isArray(product?.variantDetails) &&
      product.variantDetails.length > 0,
  );

  // Detect which variation dimensions exist
  const hasColorVariants = useMemo(() => {
    return hasVariants && product.variantDetails.some((v) => Boolean(v.color));
  }, [product, hasVariants]);

  const hasDirectSizeVariants = useMemo(() => {
    return (
      hasVariants &&
      !hasColorVariants &&
      product.variantDetails.some((v) => Boolean(v.size))
    );
  }, [product, hasVariants, hasColorVariants]);

  const hasCustomAttrVariants = useMemo(() => {
    return (
      hasVariants &&
      !hasColorVariants &&
      !hasDirectSizeVariants &&
      product.variantDetails.some((v) =>
        Boolean(v.attributeName || v.attributeValue || v.name),
      )
    );
  }, [product, hasVariants, hasColorVariants, hasDirectSizeVariants]);

  const customAttrName = useMemo(() => {
    if (!hasCustomAttrVariants) return "Option";
    const found = product.variantDetails.find((v) => v.attributeName);
    return found?.attributeName || "Option";
  }, [product, hasCustomAttrVariants]);

  // 1. Initial State Definition
  const initialVariant = useMemo(() => {
    if (!hasVariants) return null;
    const withStock = product?.variantDetails?.find((v) => {
      if (Array.isArray(v.sizes) && v.sizes.length > 0) {
        return v.sizes.some((s) => Number(s.stock || 0) > 0);
      }
      return Number(v.stock || 0) > 0;
    });
    return withStock || product?.variantDetails?.[0];
  }, [product, hasVariants]);

  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.color || "",
  );

  const [selectedSize, setSelectedSize] = useState(() => {
    if (
      hasVariants &&
      !product?.variantDetails?.some((v) => Boolean(v.color)) &&
      product?.variantDetails?.some((v) => Boolean(v.size))
    ) {
      return (
        initialVariant?.size ||
        product?.variantDetails?.[0]?.size ||
        ""
      );
    }
    return (
      initialVariant?.sizes?.find((s) => Number(s.stock || 0) > 0)?.size ||
      initialVariant?.sizes?.[0]?.size ||
      ""
    );
  });

  const [selectedAttr, setSelectedAttr] = useState(() => {
    return (
      initialVariant?.attributeValue ||
      initialVariant?.name ||
      product?.variantDetails?.[0]?.attributeValue ||
      product?.variantDetails?.[0]?.name ||
      ""
    );
  });

  // Sync state if product or initialVariant updates
  useEffect(() => {
    if (hasColorVariants && !selectedColor) {
      setSelectedColor(
        initialVariant?.color || product?.variantDetails?.[0]?.color || "",
      );
    }
    if (hasDirectSizeVariants && !selectedSize) {
      setSelectedSize(
        initialVariant?.size || product?.variantDetails?.[0]?.size || "",
      );
    }
    if (hasCustomAttrVariants && !selectedAttr) {
      setSelectedAttr(
        initialVariant?.attributeValue ||
          initialVariant?.name ||
          product?.variantDetails?.[0]?.attributeValue ||
          product?.variantDetails?.[0]?.name ||
          "",
      );
    }
  }, [
    product,
    initialVariant,
    hasColorVariants,
    hasDirectSizeVariants,
    hasCustomAttrVariants,
    selectedColor,
    selectedSize,
    selectedAttr,
  ]);

  const activeVariant = useMemo(() => {
    if (!hasVariants) return null;
    if (hasColorVariants) {
      return (
        product?.variantDetails?.find((v) => v.color === selectedColor) ||
        product?.variantDetails?.[0]
      );
    }
    if (hasDirectSizeVariants) {
      return (
        product?.variantDetails?.find((v) => v.size === selectedSize) ||
        product?.variantDetails?.[0]
      );
    }
    if (hasCustomAttrVariants) {
      return (
        product?.variantDetails?.find(
          (v) => (v.attributeValue || v.name) === selectedAttr,
        ) || product?.variantDetails?.[0]
      );
    }
    return product?.variantDetails?.[0];
  }, [
    product,
    selectedColor,
    selectedSize,
    selectedAttr,
    hasVariants,
    hasColorVariants,
    hasDirectSizeVariants,
    hasCustomAttrVariants,
  ]);

  const hasSizes = Boolean(
    hasColorVariants &&
      activeVariant &&
      Array.isArray(activeVariant.sizes) &&
      activeVariant.sizes.length > 0,
  );

  const activeSizeDetail = useMemo(() => {
    if (!hasVariants || !hasSizes) return null;
    return activeVariant?.sizes?.find((s) => s.size === selectedSize);
  }, [activeVariant, selectedSize, hasVariants, hasSizes]);

  const [quantity, setQuantity] = useState(1);

  const currentStock = hasVariants
    ? hasColorVariants
      ? hasSizes
        ? activeSizeDetail
          ? Number(activeSizeDetail.stock || 0)
          : 0
        : Number(activeVariant?.stock ?? product?.stock ?? 0)
      : Number(activeVariant?.stock ?? product?.stock ?? 0)
    : Number(product?.stock || 0);

  const priceRef = hasVariants
    ? hasColorVariants
      ? hasSizes
        ? activeSizeDetail || activeVariant?.sizes?.[0]
        : Number(activeVariant?.price) > 0
          ? activeVariant
          : { price: product?.price, discount: product?.discount }
      : activeVariant && Number(activeVariant?.price) > 0
        ? activeVariant
        : { price: product?.price, discount: product?.discount }
    : { price: product?.price, discount: product?.discount };

  const handleQtyChange = (val) => {
    if (val < 1) setQuantity(1);
    else if (val > currentStock) setQuantity(currentStock);
    else setQuantity(val);
  };

  const { addToCart, isInWishlist, toggleWishlist } = useContext(MyContext);
  const wishlisted = isInWishlist ? isInWishlist(product?._id) : false;

  // Track Meta Pixel & CAPI ViewContent on product view
  useEffect(() => {
    if (!product?._id) return;
    const viewPrice =
      Number(product?.discount) > 0
        ? Number(product.discount)
        : Number(product?.price || 0);

    trackFacebookEvent("ViewContent", {
      content_name: product?.productName,
      content_category: product?.category,
      content_ids: [product?._id],
      content_type: "product",
      value: viewPrice,
      currency: "BDT",
    });
  }, [product?._id, product?.productName, product?.category, product?.discount, product?.price]);

  const handleAddToCart = () => {
    if (hasVariants) {
      if (hasColorVariants) {
        if (!activeVariant || !selectedColor) {
          toast.error("Please select a color");
          return;
        }
        if (hasSizes && !selectedSize) {
          toast.error("Please select a size");
          return;
        }
      } else if (hasDirectSizeVariants) {
        if (!selectedSize) {
          toast.error("Please select a size");
          return;
        }
      } else if (hasCustomAttrVariants) {
        if (!selectedAttr) {
          toast.error(`Please select a ${customAttrName}`);
          return;
        }
      }
    }

    if (quantity > currentStock) {
      toast.error("Out of stock");
      return;
    }
    const result = addToCart(
      product,
      hasVariants ? activeVariant : null,
      hasSizes || hasDirectSizeVariants ? selectedSize : null,
      quantity,
    );
    if (result) {
      toast.success("Added to cart");
      const unitPrice =
        Number(priceRef?.discount) > 0
          ? Number(priceRef.discount)
          : Number(priceRef?.price || 0);

      trackFacebookEvent("AddToCart", {
        content_name: product?.productName,
        content_category: product?.category,
        content_ids: [product?._id],
        content_type: "product",
        value: unitPrice * quantity,
        currency: "BDT",
        contents: [
          {
            id: product?._id,
            quantity: quantity,
            item_price: unitPrice,
          },
        ],
      });
    }
  };

  const handleBuyNow = () => {
    if (hasVariants) {
      if (hasColorVariants) {
        if (!activeVariant || !selectedColor) {
          toast.error("Please select a color");
          return;
        }
        if (hasSizes && !selectedSize) {
          toast.error("Please select a size");
          return;
        }
      } else if (hasDirectSizeVariants) {
        if (!selectedSize) {
          toast.error("Please select a size");
          return;
        }
      } else if (hasCustomAttrVariants) {
        if (!selectedAttr) {
          toast.error(`Please select a ${customAttrName}`);
          return;
        }
      }
    }

    if (quantity > currentStock) {
      toast.error("Out of stock");
      return;
    }

    const result = addToCart(
      product,
      hasVariants ? activeVariant : null,
      hasSizes || hasDirectSizeVariants ? selectedSize : null,
      quantity,
    );

    if (result) {
      const unitPrice =
        Number(priceRef?.discount) > 0
          ? Number(priceRef.discount)
          : Number(priceRef?.price || 0);

      trackFacebookEvent("AddToCart", {
        content_name: product?.productName,
        content_category: product?.category,
        content_ids: [product?._id],
        content_type: "product",
        value: unitPrice * quantity,
        currency: "BDT",
        contents: [
          {
            id: product?._id,
            quantity: quantity,
            item_price: unitPrice,
          },
        ],
      });

      router.push("/cart/checkout");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-6">
      {/* LEFT BLOCK: Dynamic React Image Sliders Node */}
      <div className="lg:col-span-5 w-full">
        <ProductImages product={product} selectedColor={selectedColor} />
      </div>

      {/* RIGHT BLOCK: Dynamic Interactive Control Panel */}
      <div className="lg:col-span-7">
        <div className="badge badge-success badge-soft mb-3">
          <FaStar /> Best Seller
        </div>
        <h1 className="font-bold text-2xl lg:text-4xl">
          {product?.productName}
        </h1>
        {/* PRICE DISPLAY BLOCK */}
        <div>
          {priceRef?.discount ? (
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-2xl lg:text-3xl text-main">
                <span className="font-hind-siliguri">৳</span>
                {priceRef?.discount}
              </span>
              <span className="line-through text-sm opacity-50">
                <span className="font-hind-siliguri">৳</span>
                {priceRef?.price}
              </span>
            </div>
          ) : (
            <span className="font-bold text-2xl lg:text-3xl text-main">
              <span className="font-hind-siliguri">৳</span>
              {priceRef?.price}
            </span>
          )}
        </div>

        <div className="bg-base-100 p-4 xs:p-5 rounded-box shadow-xs h-fit my-5">
          {hasVariants && (
            <>
              {/* 1. COLOR VARIANT SELECTOR (Only if Color variation exists) */}
              {hasColorVariants && (
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    Color:{" "}
                    <span className="text-neutral-400 font-normal">
                      {selectedColor}
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {product?.variantDetails?.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => {
                          setSelectedColor(variant.color);
                          if (
                            Array.isArray(variant?.sizes) &&
                            variant.sizes.length > 0
                          ) {
                            setSelectedSize(
                              variant.sizes.find(
                                (s) => Number(s.stock || 0) > 0,
                              )?.size ||
                                variant.sizes[0]?.size ||
                                "",
                            );
                          } else {
                            setSelectedSize("");
                          }
                          setQuantity(1);
                        }}
                        className="cursor-pointer"
                      >
                        <div
                          className={`size-12 rounded-lg overflow-hidden border ${
                            selectedColor === variant.color
                              ? "border-main border-2"
                              : "border-base-300"
                          }`}
                        >
                          {variant?.swatchImage ? (
                            <img
                              src={variant.swatchImage}
                              alt={variant.color}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-xs font-bold"
                              style={{
                                backgroundColor: variant.hex || "#333333",
                                color: "#ffffff",
                              }}
                            >
                              {variant.color?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SIZE SELECTOR WITH SIZE GUIDE BUTTON (Nested under Color) */}
              {hasColorVariants && hasSizes && (
                <div className="my-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      Size:{" "}
                      <span className="text-neutral-400 font-normal">
                        {selectedSize}
                      </span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => sizeGuideRef.current?.showModal()}
                      className="btn btn-ghost btn-xs text-main gap-1 hover:underline"
                    >
                      <LuRuler className="text-sm" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {activeVariant?.sizes?.map((item) => {
                      const isOutOfStock = Number(item.stock || 0) <= 0;
                      return (
                        <button
                          key={item.size}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedSize(item.size);
                            setQuantity(1);
                          }}
                          className={`btn btn-sm btn-square rounded-box transition-all ${
                            isOutOfStock
                              ? "opacity-40 cursor-not-allowed"
                              : selectedSize === item.size
                                ? "btn-main"
                                : "btn-outline"
                          }`}
                        >
                          {item.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. SIZE-ONLY SELECTOR (When product has only size variations, no color) */}
              {hasDirectSizeVariants && (
                <div className="my-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      Size:{" "}
                      <span className="text-neutral-400 font-normal">
                        {selectedSize}
                      </span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => sizeGuideRef.current?.showModal()}
                      className="btn btn-ghost btn-xs text-main gap-1 hover:underline"
                    >
                      <LuRuler className="text-sm" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {product?.variantDetails?.map((variant) => {
                      const isOutOfStock = Number(variant.stock || 0) <= 0;
                      return (
                        <button
                          key={variant.size}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedSize(variant.size);
                            setQuantity(1);
                          }}
                          className={`btn btn-sm min-w-10 rounded-box transition-all ${
                            isOutOfStock
                              ? "opacity-40 cursor-not-allowed"
                              : selectedSize === variant.size
                                ? "btn-main"
                                : "btn-outline"
                          }`}
                        >
                          {variant.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. CUSTOM ATTRIBUTE SELECTOR (e.g. Material, Fabric, Fit) */}
              {hasCustomAttrVariants && (
                <div className="my-4">
                  <h3 className="font-bold text-sm">
                    {customAttrName}:{" "}
                    <span className="text-neutral-400 font-normal">
                      {selectedAttr}
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {product?.variantDetails?.map((variant) => {
                      const val = variant.attributeValue || variant.name;
                      const isOutOfStock = Number(variant.stock || 0) <= 0;
                      return (
                        <button
                          key={val}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedAttr(val);
                            setQuantity(1);
                          }}
                          className={`btn btn-sm rounded-box transition-all ${
                            isOutOfStock
                              ? "opacity-40 cursor-not-allowed"
                              : selectedAttr === val
                                ? "btn-main"
                                : "btn-outline"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 3. STOCK & QUANTITY CONTROLS */}
          <div className="my-4 pt-2 border-t border-base-300">
            <p className="text-sm">
              Availability:{" "}
              {currentStock > 0 ? (
                <span className="badge badge-success badge-sm font-bold text-white">
                  {currentStock} Items In Stock
                </span>
              ) : (
                <span className="badge badge-error badge-sm font-bold text-white">
                  Out of Stock
                </span>
              )}
            </p>

            {currentStock > 0 && (
              <div className="my-4 flex items-center gap-3">
                <span className="text-sm font-bold">Quantity:</span>
                <div className="join border border-base-300 rounded-box bg-base-100">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    className="btn btn-sm btn-ghost join-item"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 flex items-center font-semibold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    className="btn btn-sm btn-ghost join-item"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACTION TRIGGER BUNDLES */}
          <div className="flex gap-3 mt-5">
            <button
              disabled={currentStock === 0}
              onClick={handleAddToCart}
              className={`btn ${
                currentStock === 0 ? "btn-disabled" : "btn-neutral"
              } flex-1`}
            >
              Add to Cart
            </button>
            <button
              disabled={currentStock === 0}
              onClick={handleBuyNow}
              className={`btn ${currentStock === 0 ? "" : "btn-main"} flex-1`}
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist?.(product)}
              className={`btn btn-square ${
                wishlisted ? "btn-error btn-soft" : "btn-outline"
              }`}
              title={wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            >
              {wishlisted ? (
                <FaHeart className="text-error size-5" />
              ) : (
                <FaRegHeart className="size-5" />
              )}
            </button>
          </div>
        </div>
        <TrustBadges />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal ref={sizeGuideRef} category={product?.category} />
    </div>
  );
};

export default ProductInteractiveLayer;
