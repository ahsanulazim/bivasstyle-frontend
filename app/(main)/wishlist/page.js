"use client";

import ProductCard from "@/components/ui/ProductCard";
import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuHeart, LuHouse, LuShoppingBag } from "react-icons/lu";

const WishlistPage = () => {
  const { wishlistItems = [] } = useContext(MyContext);

  return (
    <div className="min-h-[70vh] px-5 py-6">
      <div className="max-w-360 mx-auto space-y-6">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/">
                <LuHouse />
              </Link>
            </li>
            <li>My Wishlist</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LuHeart className="text-error" /> Saved Wishlist (
              {wishlistItems.length})
            </h1>
            <p className="text-xs opacity-60 mt-0.5">
              Keep track of your favorite Oiki Lifestyle pieces.
            </p>
          </div>
          <Link href="/products" className="btn btn-sm btn-outline">
            <LuShoppingBag /> Continue Shopping
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-base-100 rounded-box p-12 text-center border border-base-300 max-w-lg mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
              <LuHeart size={30} />
            </div>
            <h2 className="text-xl font-bold">Your Wishlist is Empty</h2>
            <p className="text-sm opacity-70">
              Tap the heart icon on any outfit to save it here for later.
            </p>
            <Link href="/products">
              <button className="btn btn-main">Explore Collections</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

