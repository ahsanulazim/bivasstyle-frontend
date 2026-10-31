"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuMail, LuMapPin, LuPhone, LuSquarePen, LuUser } from "react-icons/lu";
import SettingsCard from "../settings/SettingsCard";

const AccountInfo = () => {
  const { newUser, loading } = useContext(MyContext);
  const user = newUser?.user || {};

  return (
    <SettingsCard title="Account Info" icon={LuUser}>
      {loading ? (
        <div className="py-4 text-center">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full overflow-hidden bg-main/15 text-main flex items-center justify-center font-bold shrink-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs opacity-60 truncate">{user.email}</p>
            </div>
          </div>

          <ul className="flex flex-col gap-2 text-xs opacity-80 border-t border-base-200 pt-3">
            <li className="flex items-center gap-3">
              <LuPhone className="size-3.5 text-main shrink-0" />
              <span>
                {user.phone ||
                  user.shippingAddress?.phone ||
                  "No Phone Number Provided"}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <LuMapPin className="size-3.5 text-main shrink-0" />
              <span className="truncate">
                {user.shippingAddress?.address
                  ? `${user.shippingAddress.address}, ${user.shippingAddress.thana || ""}`
                  : "No Default Address Saved"}
              </span>
            </li>
          </ul>
        </div>
      )}
      <Link href="/dashboard/settings" className="mt-4 block">
        <button className="btn btn-sm btn-main w-full gap-1.5">
          <LuSquarePen className="size-3.5" /> Edit Profile & Photo
        </button>
      </Link>
    </SettingsCard>
  );
};

export default AccountInfo;
