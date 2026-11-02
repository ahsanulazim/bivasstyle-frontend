"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { MyContext } from "@/context/MyProvider";
import {
  LuLayoutGrid,
  LuTag,
  LuX,
  LuHeart,
  LuUser,
  LuShoppingBag,
} from "react-icons/lu";
import Alert from "./Alert";
import Dock from "./Dock";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Sidebar = ({ children }) => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    newUser,
    wishlistItems = [],
  } = useContext(MyContext) || {};

  const categoryList = Array.isArray(categories) ? categories : [];

  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById("my-drawer-2");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col relative">
        {/* Alert */}
        {/* <Alert /> */}
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <main className="bg-base-200">{children}</main>
        <Footer />
        <div className="relative">
          <Dock />
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-100 min-h-full w-80 max-w-[85vw] p-4 flex flex-col justify-between shadow-xl">
          <div className="flex-1 overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-base-300">
              <Link
                href="/"
                onClick={closeDrawer}
                className="flex items-center gap-2"
              >
                <Image
                  src="/assets/logo.svg"
                  alt="Bivas Style"
                  width={36}
                  height={36}
                  className="w-9 h-auto"
                />
                <span className="font-bold text-lg tracking-tight text-main">
                  Bivas Style
                </span>
              </Link>
              <label
                htmlFor="my-drawer-2"
                aria-label="close sidebar"
                className="btn btn-sm btn-circle btn-ghost"
              >
                <LuX className="size-5" />
              </label>
            </div>

            {/* Navigation Menu */}
            <ul className="menu menu-md p-0 gap-1">
              <li className="menu-title text-xs font-semibold uppercase tracking-wider text-base-content/70 px-2 py-1">
                Categories
              </li>

              <li>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 py-2.5 font-medium rounded-lg hover:bg-base-200"
                >
                  <LuLayoutGrid className="size-4 text-main shrink-0" />
                  <span>All Products</span>
                </Link>
              </li>

              {categoriesLoading ? (
                <div className="flex flex-col gap-2 px-2 py-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton h-8 w-full rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : categoriesError ? (
                <li className="text-sm text-error px-3 py-2">
                  Failed to load categories
                </li>
              ) : categoryList.length === 0 ? (
                <li className="text-sm text-base-content/60 px-3 py-2">
                  No categories found
                </li>
              ) : (
                categoryList.map((category) => (
                  <li key={category._id || category.slug}>
                    <Link
                      href={`/products/${category.slug}`}
                      onClick={closeDrawer}
                      className="flex items-center gap-3 py-2.5 rounded-lg hover:bg-base-200"
                    >
                      {category.coverThumbnail ? (
                        <Image
                          src={category.coverThumbnail}
                          alt={category.name || "category"}
                          width={24}
                          height={24}
                          unoptimized
                          className="size-6 object-cover rounded shrink-0"
                        />
                      ) : (
                        <LuTag className="size-4 text-base-content/70 shrink-0" />
                      )}
                      <span className="capitalize">{category.name}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Bottom Account & Quick Links */}
          <div className="pt-4 mt-2 border-t border-base-300">
            <ul className="menu menu-md p-0 gap-1">
              <li>
                <Link
                  href={newUser ? "/dashboard" : "/login"}
                  onClick={closeDrawer}
                  className="flex items-center gap-3 py-2 rounded-lg hover:bg-base-200"
                >
                  <LuUser className="size-4 text-main shrink-0" />
                  <span>{newUser ? "My Dashboard" : "Sign In / Register"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  onClick={closeDrawer}
                  className="flex items-center justify-between py-2 rounded-lg hover:bg-base-200"
                >
                  <div className="flex items-center gap-3">
                    <LuHeart className="size-4 text-main shrink-0" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistItems.length > 0 && (
                    <span className="badge badge-sm badge-main text-white">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 py-2 rounded-lg hover:bg-base-200"
                >
                  <LuShoppingBag className="size-4 text-main shrink-0" />
                  <span>Cart</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
