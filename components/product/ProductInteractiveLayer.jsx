"use client";

import { useState, useMemo, useContext, useRef } from "react";
import ProductImages from "./ProductImages";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import { LuRuler } from "react-icons/lu";
import TrustBadges from "./TrustBadges";
import SizeGuideModal from "./SizeGuideModal";
import { MyContext } from "@/context/MyProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProductInteractiveLayer = ({ product }) => {
  const router = useRouter();
  const sizeGuideRef = useRef(null);

  // 1. Initial State Definition
  const initialVariant = useMemo(() => {
    const withStock = product?.variantDetails?.find((v) =>
      v.sizes?.some((s) => s.stock > 0),
    );
    return withStock || product?.variantDetails?.[0];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.color || "",
  );

  const activeVariant = useMemo(() => {
    return product?.variantDetails?.find((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(
    initialVariant?.sizes?.find((s) => s.stock > 0)?.size ||
      initialVariant?.sizes?.[0]?.size ||
      "",
  );

  const activeSizeDetail = useMemo(() => {
    return activeVariant?.sizes?.find((s) => s.size === selectedSize);
  }, [activeVariant, selectedSize]);

  const [quantity, setQuantity] = useState(1);
  const currentStock = activeSizeDetail ? activeSizeDetail.stock : 0;
  const priceRef = activeSizeDetail || activeVariant?.sizes?.[0];

  const handleQtyChange = (val) => {
    if (val < 1) setQuantity(1);
    else if (val > currentStock) setQuantity(currentStock);
    else setQuantity(val);
  };

  const { addToCart, isInWishlist, toggleWishlist } = useContext(MyContext);
  const wishlisted = isInWishlist ? isInWishlist(product?._id) : false;

  const handleAddToCart = () => {
    if (!activeVariant) {
      toast.error("Please select a color");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (quantity > currentStock) {
      toast.error("Out of stock");
      return;
    }
    const result = addToCart(product, activeVariant, selectedSize, quantity);
    if (result) {
      toast.success("Added to cart");
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
          {/* 1. COLOR VARIANT SELECTOR */}
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
                    setSelectedSize(
                      variant?.sizes?.find((s) => s.stock > 0)?.size || "",
                    );
                    setQuantity(1);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`size-12 rounded-lg overflow-hidden border ${
                      selectedColor === variant.color
                        ? "border-main"
                        : "border-base-300"
                    }`}
                  >
                    <img
                      src={variant?.swatchImage}
                      alt={variant.color}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. SIZE SELECTOR WITH SIZE GUIDE BUTTON */}
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
                const isOutOfStock = item.stock <= 0;
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
                        ? ""
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
              className={`btn ${currentStock === 0 ? "" : "btn-main"} flex-1`}
              onClick={() => {
                const result = addToCart(
                  product,
                  activeVariant,
                  selectedSize,
                  quantity,
                  true,
                );
                if (result) {
                  toast.success("Added to cart");
                  router.push("/cart/checkout");
                }
              }}
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
