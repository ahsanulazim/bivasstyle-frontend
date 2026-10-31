"use client";

import { MyContext } from "@/context/MyProvider";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  LuBell,
  LuCalendar,
  LuLock,
  LuMail,
  LuMapPin,
  LuShieldCheck,
  LuUser,
} from "react-icons/lu";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import NotificationPreferences from "./NotificationPreferences";
import ProfileForm from "./ProfileForm";
import ShippingAddress from "./ShippingAddress";

const TABS = [
  { key: "all", label: "All Settings", icon: LuUser },
  { key: "profile", label: "Profile & Photo", icon: LuUser },
  { key: "shipping", label: "Shipping Address", icon: LuMapPin },
  { key: "security", label: "Security & Password", icon: LuLock },
  { key: "notifications", label: "Notifications", icon: LuBell },
];

const Settings = () => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!loading && !newUser) {
      router.push("/login");
    }
  }, [loading, newUser, router]);

  const user = newUser?.user || {};
  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Profile Overview Hero Banner */}
      <div className="bg-base-100 rounded-box border border-base-300 overflow-hidden shadow-xs">
        <div className="h-24 bg-linear-to-r from-main/90 via-main/70 to-neutral/80" />
        <div className="px-6 pb-5 -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="size-20 rounded-full overflow-hidden ring-4 ring-base-100 bg-base-200 text-main flex items-center justify-center shadow-md shrink-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">{initials}</span>
              )}
            </div>

            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{user.name || "Account"}</h2>
                <span
                  className={`badge badge-xs uppercase font-bold ${
                    user.role === "admin"
                      ? "badge-success"
                      : "badge-info badge-soft"
                  }`}
                >
                  {user.role || "Customer"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-65 mt-1">
                <span className="flex items-center gap-1">
                  <LuMail className="size-3.5" /> {user.email}
                </span>
                {user.createdAt && (
                  <span className="flex items-center gap-1">
                    <LuCalendar className="size-3.5" /> Joined{" "}
                    {moment(user.createdAt).format("MMM YYYY")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-base-200/70 p-1.5 rounded-xl">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`btn btn-xs rounded-lg gap-1.5 ${
                    activeTab === tab.key
                      ? "btn-main text-white"
                      : "btn-ghost opacity-75"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {(activeTab === "all" || activeTab === "profile") && <ProfileForm />}
          {(activeTab === "all" || activeTab === "shipping") && (
            <ShippingAddress />
          )}
          {(activeTab === "all" || activeTab === "security") && (
            <ChangePassword />
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {(activeTab === "all" || activeTab === "notifications") && (
            <NotificationPreferences />
          )}
          {(activeTab === "all" || activeTab === "security") && <DangerZone />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
