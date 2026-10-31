"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import TakaSymbol from "./TakaSymbol";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useContext(MyContext);

  const firstVariantWithStock = product?.variantDetails?.find((v) =>
    v.sizes?.some((s) => s.stock > 0),
  );
  const isOutOfStock = !firstVariantWithStock;
  const firstVariant = firstVariantWithStock || product?.variantDetails?.[0];
  const displaySize =
    firstVariant?.sizes?.find((s) => s.stock > 0) || firstVariant?.sizes?.[0];

  const regularPrice = Number(displaySize?.price ?? product?.price ?? 0);
  const discountPrice = Number(displaySize?.discount ?? product?.discount ?? 0);
  const hasDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const discountPct = hasDiscount
    ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100)
    : 0;

  const wishlisted = isInWishlist ? isInWishlist(product?._id) : false;

  return (
    <div className="card bg-base-100 shadow-sm overflow-clip group relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist?.(product);
        }}
        className="btn btn-circle btn-xs bg-base-100/80 hover:bg-base-100 border-none shadow-sm absolute top-3 right-3 z-10"
        title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {wishlisted ? (
          <FaHeart className="text-error size-3.5" />
        ) : (
          <FaRegHeart className="size-3.5 opacity-70" />
        )}
      </button>

      <Link href={`/products/${product.category}/${product.slug}`}>
        <figure className="relative">
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {hasDiscount ? (
              <div className="badge badge-error text-white max-md:badge-sm font-bold">
                -{discountPct}%
              </div>
            ) : (
              !isOutOfStock && (
                <div className="badge badge-success max-md:badge-sm">New</div>
              )
            )}
          </div>
          <img
            src={firstVariant?.swatchImage || product.productImages?.[0]}
            alt={product.productName}
            className="aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </figure>
      </Link>
      <div className="card-body p-3">
        <Link href={`/products/${product.category}/${product.slug}`}>
          <h2 className="card-title text-xs xs:text-sm font-normal line-clamp-2">
            {product.productName}
          </h2>
        </Link>
        {hasDiscount ? (
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm xs:text-lg text-main">
              <TakaSymbol />
              {discountPrice}
            </span>
            <span className="line-through text-xs opacity-50">
              <TakaSymbol />
              {regularPrice}
            </span>
          </div>
        ) : (
          <p className="font-bold text-sm xs:text-lg">
            <TakaSymbol />
            {regularPrice}
          </p>
        )}
        <div className="card-actions justify-end">
          <Link
            href={`/products/${product.category}/${product.slug}`}
            className={`btn btn-sm w-full ${
              isOutOfStock ? "btn-disabled" : "btn-main"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
