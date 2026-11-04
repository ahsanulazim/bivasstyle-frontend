"use client";

import ActiveLink from "@/components/dashboard/ActiveLink";
import DashNav from "@/components/dashboard/DashNav";
import { MyContext } from "@/context/MyProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import {
  LuBox,
  LuFileBox,
  LuHeart,
  LuLayoutDashboard,
  LuNotebook,
  LuSettings,
  LuStore,
  LuSwatchBook,
  LuTag,
  LuTrendingUp,
  LuTruck,
  LuUser,
} from "react-icons/lu";

// Sidebar navigation, grouped into sections for easier scanning
const adminNav = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, exact: true },
      { href: "/dashboard/analytics", label: "Analytics & Reports", icon: LuTrendingUp },
    ],
  },
  {
    title: "Sales",
    items: [
      { href: "/dashboard/orders", label: "Orders", icon: LuFileBox },
      { href: "/dashboard/coupons", label: "Coupons & Discounts", icon: LuTag },
      { href: "/dashboard/shipping", label: "Shipping", icon: LuTruck },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/dashboard/products", label: "Products", icon: LuBox },
      { href: "/dashboard/categories", label: "Categories", icon: LuNotebook },
      { href: "/dashboard/attributes", label: "Attributes", icon: LuSwatchBook },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/dashboard/users", label: "Users", icon: LuUser },
      { href: "/dashboard/settings", label: "Settings", icon: LuSettings },
    ],
  },
];

const customerNav = [
  {
    title: "My Account",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, exact: true },
      { href: "/dashboard/orders", label: "My Orders", icon: LuFileBox },
      { href: "/wishlist", label: "My Wishlist", icon: LuHeart },
      { href: "/track-order", label: "Track Order", icon: LuTruck },
      { href: "/dashboard/settings", label: "Settings", icon: LuSettings },
    ],
  },
];

// Dashboard routes customers are allowed to visit; everything else is admin-only.
// NOTE: this is a UX guard only – the backend must still enforce roles on its APIs.
const isCustomerAllowedRoute = (pathname) =>
  pathname === "/dashboard" ||
  pathname === "/dashboard/orders" ||
  pathname === "/dashboard/settings" ||
  pathname.startsWith("/dashboard/settings/");

const DashboardClientLayout = ({ children }) => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!loading && !newUser) {
      router.push("/login");
    }
  }, [loading, newUser, router]);

  // Auto-close the drawer on mobile after navigating
  // (on desktop the checkbox controls the collapsed/expanded state, so leave it alone)
  useEffect(() => {
    if (
      drawerRef.current &&
      typeof window !== "undefined" &&
      !window.matchMedia("(min-width: 1024px)").matches
    ) {
      drawerRef.current.checked = false;
    }
  }, [pathname]);

  const isAdmin = newUser?.user?.role === "admin";
  const navGroups = isAdmin ? adminNav : customerNav;
  const isForbidden =
    !loading && !!newUser && !isAdmin && !isCustomerAllowedRoute(pathname);

  // Send non-admins away from admin-only pages
  useEffect(() => {
    if (isForbidden) {
      router.replace("/dashboard");
    }
  }, [isForbidden, router]);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content flex flex-col min-w-0">
        {/* Navbar */}
        <DashNav />
        {/* Page content here */}
        <main className="p-4 md:p-6 bg-base-300 min-h-[calc(100dvh-64px)]">
          {loading || !newUser || isForbidden ? (
            <div className="flex h-[60vh] items-center justify-center">
              <span className="loading loading-spinner loading-lg text-main"></span>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      <div className="drawer-side z-40 is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="flex min-h-full flex-col bg-base-100 border-r border-base-300 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex h-16 items-center gap-2 px-4 border-b border-base-300 is-drawer-close:justify-center is-drawer-close:px-0"
          >
            <Image
              src="/assets/logo.svg"
              alt="Bivas Style logo"
              width={32}
              height={24}
            />
            <div className="is-drawer-close:hidden leading-tight">
              <p className="font-bold text-sm">Bivas Style</p>
              <p className="text-[10px] uppercase tracking-wider opacity-60">
                {isAdmin ? "Admin Panel" : "My Account"}
              </p>
            </div>
          </Link>

          {/* Sidebar content here */}
          <ul className="menu w-full grow gap-0.5">
            {navGroups.map((group) => (
              <li key={group.title} className="mt-2 first:mt-0">
                <h2 className="menu-title text-[10px] uppercase tracking-wider is-drawer-close:hidden">
                  {group.title}
                </h2>
                <ul className="ms-0 ps-0 before:hidden">
                  {group.items.map(({ href, label, icon: Icon, exact }) => (
                    <li key={href}>
                      <ActiveLink href={href} exact={exact} dataTip={label}>
                        <Icon className="my-1.5 inline-block size-4 shrink-0" />
                        <span className="is-drawer-close:hidden">{label}</span>
                      </ActiveLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Footer shortcut */}
          <ul className="menu w-full border-t border-base-300">
            <li>
              <Link
                href="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Visit Storefront"
              >
                <LuStore className="my-1.5 inline-block size-4 shrink-0" />
                <span className="is-drawer-close:hidden">Visit Storefront</span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardClientLayout;

