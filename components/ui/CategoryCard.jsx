"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LuArrowUpRight, LuFolderOpen } from "react-icons/lu";

const CategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  const title = category?.name || category?.title || "Category";
  const slug = category?.slug;
  const href = slug ? `/products/${slug}` : category?.link || "/products";
  const imageSrc = category?.coverThumbnail || category?.image || "";

  const isRemoteCloudinary =
    typeof imageSrc === "string" &&
    (imageSrc.startsWith("/") || imageSrc.includes("res.cloudinary.com"));

  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-base-200 border border-base-300/60 shadow-xs hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-main/40"
    >
      {/* Background Image / Placeholder */}
      {imageSrc && !imageError ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={!isRemoteCloudinary}
          onError={() => setImageError(true)}
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-main/10 via-base-200 to-base-300 text-main/50 p-4">
          <LuFolderOpen className="size-10 sm:size-12 mb-2 opacity-60 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-base-content/60 text-center line-clamp-1">
            {title}
          </span>
        </div>
      )}

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

      {/* Featured Badge if featured */}
      {category?.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge badge-sm badge-warning/90 backdrop-blur-md text-[10px] sm:text-xs font-semibold border-none shadow-xs text-black">
            Featured
          </span>
        </div>
      )}

      {/* Card Content Footer */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex flex-col justify-end z-10">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-medium block mb-0.5">
              Collection
            </span>
            <h3 className="text-white text-sm sm:text-base md:text-lg font-bold leading-snug line-clamp-1 drop-shadow-sm group-hover:text-amber-200 transition-colors">
              {title}
            </h3>
          </div>

          <div className="size-8 sm:size-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:bg-main group-hover:text-white group-hover:rotate-45 transition-all duration-300 shadow-sm">
            <LuArrowUpRight className="size-4 sm:size-4.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
