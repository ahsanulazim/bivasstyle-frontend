"use client";

import ActiveLink from "@/components/dashboard/ActiveLink";
import DashNav from "@/components/dashboard/DashNav";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import {
  LuBox,
  LuFileBox,
  LuLayoutDashboard,
  LuNotebook,
  LuSettings,
  LuSwatchBook,
  LuTag,
  LuTruck,
  LuUser,
} from "react-icons/lu";

const Layout = ({ children }) => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !newUser) {
      router.push("/login");
    }
  }, [loading, newUser, router]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <DashNav />
        {/* Page content here */}
        <main className="p-4 bg-base-300 min-h-[calc(100dvh-64px)]">
          {children}
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <ActiveLink
                href="/dashboard"
                exact={true}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Dashboard"
              >
                <LuLayoutDashboard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/orders"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Orders"
              >
                <LuFileBox className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Orders</span>
              </ActiveLink>
            </li>
            {newUser?.user?.role === "admin" && (
              <>
                <li>
                  <ActiveLink
                    href="/dashboard/products"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Products"
                  >
                    <LuBox className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Products</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink
                    href="/dashboard/categories"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Categories"
                  >
                    <LuNotebook className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Categories</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink
                    href="/dashboard/attributes"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Attributes"
                  >
                    <LuSwatchBook className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Attributes</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink
                    href="/dashboard/coupons"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Coupons & Discounts"
                  >
                    <LuTag className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">
                      Coupons & Discounts
                    </span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink
                    href="/dashboard/shipping"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Shipping"
                  >
                    <LuTruck className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Shipping</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink
                    href="/dashboard/users"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    dataTip="Users"
                  >
                    <LuUser className="my-1.5 inline-block size-4" />
                    <span className="is-drawer-close:hidden">Users</span>
                  </ActiveLink>
                </li>
              </>
            )}
            <li>
              <ActiveLink
                href="/dashboard/settings"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Settings"
              >
                <LuSettings className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Settings</span>
              </ActiveLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Layout;
