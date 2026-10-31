"use client";
import { getPublicCoupons } from "@/api/couponApi";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaMoon } from "react-icons/fa6";
import {
  LuCheck,
  LuCopy,
  LuHeart,
  LuMegaphone,
  LuMenu,
  LuSearch,
  LuUser,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";
import Cart from "./Cart";
import Search from "./Search";

const Navbar = () => {
  const { newUser, wishlistItems = [] } = useContext(MyContext);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [copiedBannerCode, setCopiedBannerCode] = useState(false);
  const router = useRouter();

  const { data: publicCouponsData } = useQuery({
    queryKey: ["publicCoupons"],
    queryFn: getPublicCoupons,
  });

  const bannerCoupon = (publicCouponsData?.coupons || []).find(
    (c) => c.showBanner,
  );

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileQuery.trim()) return;
    setMobileSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(mobileQuery.trim())}`);
  };

  const handleCopyBannerCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedBannerCode(true);
    toast.success(`Coupon code "${code}" copied!`);
    setTimeout(() => setCopiedBannerCode(false), 2000);
  };

  return (
    <header className="bg-base-100 border-b border-b-base-300 sticky top-0 z-20">
      {/* Top Storefront Promotional Announcement Bar (Controlled from Admin Coupons) */}
      {bannerCoupon && (
        <div className="bg-main text-white text-xs py-1.5 px-4">
          <div className="max-w-360 mx-auto flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="flex items-center gap-1.5 font-medium">
              <LuMegaphone className="size-3.5 animate-bounce" />
              {bannerCoupon.title}:
            </span>
            <span className="opacity-90">
              {bannerCoupon.description ||
                (bannerCoupon.discountType === "percentage"
                  ? `Get ${bannerCoupon.discountValue}% OFF`
                  : bannerCoupon.discountType === "fixed"
                    ? `Get ৳${bannerCoupon.discountValue} OFF`
                    : "Enjoy FREE Shipping")}
            </span>
            <button
              type="button"
              onClick={() => handleCopyBannerCode(bannerCoupon.code)}
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-mono font-bold transition-colors cursor-pointer"
              title="Click to copy code"
            >
              <span>Code: {bannerCoupon.code}</span>
              {copiedBannerCode ? (
                <LuCheck className="size-3" />
              ) : (
                <LuCopy className="size-3" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="navbar max-w-360 mx-auto gap-4 lg:gap-20">
        <div className="navbar-start lg:w-auto">
          <label
            htmlFor="my-drawer-2"
            aria-label="open sidebar"
            className="cursor-pointer lg:hidden mr-2"
          >
            <LuMenu className="inline-block h-6 w-6 stroke-current text-error" />
          </label>
          <Link href="/" className="hidden lg:block">
            <Image
              src="/assets/oiki-logo.svg"
              alt="oiki logo"
              width={65}
              height={30}
              priority
            />
          </Link>
        </div>

        <div className="navbar-center flex-1 justify-center">
          <Search />
          <Link href="/" className="block lg:hidden">
            <Image
              src="/assets/oiki-logo.svg"
              alt="oiki logo"
              width={90}
              height={36}
              priority
              className="min-w-12"
            />
          </Link>
        </div>

        <div className="navbar-end lg:w-auto">
          <Link href="/products">
            <button className="btn btn-outline border-main rounded-full mr-4 max-lg:hidden hover:[&>svg]:text-white hover:bg-main hover:text-white">
              <FaMoon className="h-4 w-4 animate-pulse text-main" />
              Shop All
            </button>
          </Link>

          <Link href={newUser ? "/dashboard" : "/login"}>
            <button className="hidden lg:inline-flex btn btn-main rounded-full">
              <LuUser className="size-[1.2rem]" />
              {newUser ? "Dashboard" : "Account"}
            </button>
          </Link>

          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label="Toggle mobile search"
          >
            {mobileSearchOpen ? (
              <LuX className="h-5 w-5" />
            ) : (
              <LuSearch className="h-5 w-5" />
            )}
          </button>

          <Link href="/wishlist">
            <button
              className="btn btn-ghost btn-circle indicator"
              title="My Wishlist"
            >
              {wishlistItems.length > 0 && (
                <span className="indicator-item badge badge-xs badge-main text-white">
                  {wishlistItems.length}
                </span>
              )}
              <LuHeart className="h-5 w-5" />
            </button>
          </Link>

          <Cart />
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden p-3 bg-base-200 border-t border-base-300">
          <form
            onSubmit={handleMobileSearch}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              placeholder="Search products..."
              className="input input-sm flex-1 rounded-full bg-base-100"
            />
            <button type="submit" className="btn btn-sm btn-main rounded-full">
              <LuSearch className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
