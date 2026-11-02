"use client";

import Link from "next/link";
import UserDropdown from "./UserDropdown";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSocket } from "@/context/SocketProvider";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/analytics": "Analytics & Reports",
  "/dashboard/orders": "Orders",
  "/dashboard/products": "Products",
  "/dashboard/products/add-product": "Add Product",
  "/dashboard/products/edit-product": "Edit Product",
  "/dashboard/categories": "Categories",
  "/dashboard/attributes": "Attributes",
  "/dashboard/coupons": "Coupons & Discounts",
  "/dashboard/shipping": "Shipping",
  "/dashboard/users": "Users",
  "/dashboard/settings": "Settings",
};

const getPageTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/dashboard/orders/")) return "Order Details";
  if (pathname.startsWith("/dashboard/attributes/")) return "Attribute Values";
  return "Dashboard";
};

const DashNav = () => {
  const { isConnected } = useSocket();
  const pathname = usePathname();

  return (
    <header className="navbar sticky top-0 z-30 bg-base-100/95 backdrop-blur border-b border-base-300 px-2 md:px-4 min-h-16">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <label
          htmlFor="my-drawer-4"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="btn btn-square btn-ghost btn-sm"
        >
          {/* Sidebar toggle icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="my-1.5 inline-block size-5"
          >
            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
            <path d="M9 4v16"></path>
            <path d="M14 10l2 2l-2 2"></path>
          </svg>
        </label>
        {/* Logo only on mobile – on desktop it lives in the sidebar */}
        <Link href="/dashboard" className="lg:hidden shrink-0">
          <Image
            src="/assets/logo.svg"
            alt="Bivas Style logo"
            width={36}
            height={26}
          />
        </Link>
        <span className="hidden lg:block h-5 w-px bg-base-300" />
        <h1 className="font-semibold text-base truncate">
          {getPageTitle(pathname)}
        </h1>
      </div>
      <div className="flex-none flex items-center gap-3">
        <span
          className="hidden sm:inline-flex items-center gap-1.5 text-xs opacity-70"
          title={isConnected ? "Live updates connected" : "Reconnecting to live updates"}
        >
          <span
            className={`status ${isConnected ? "status-success animate-pulse" : "status-warning"}`}
          ></span>
          {isConnected ? "Live" : "Offline"}
        </span>
        <UserDropdown />
      </div>
    </header>
  );
};

export default DashNav;
