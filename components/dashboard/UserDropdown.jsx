"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext, useRef } from "react";
import { LuLogOut, LuSettings, LuStore } from "react-icons/lu";
import LogoutModal from "./LogoutModal";

const UserDropdown = () => {
  const logoutRef = useRef();
  const { newUser, loading } = useContext(MyContext);
  const user = newUser?.user || {};

  return (
    <>
      <LogoutModal ref={logoutRef} />
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar avatar-placeholder"
        >
          <div className="w-10 rounded-full bg-main/15 text-main ring-2 ring-base-300 overflow-hidden">
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
        </div>
        <ul
          tabIndex="-1"
          className="menu dropdown-content bg-base-100 rounded-box z-20 mt-3 w-56 p-2 shadow-lg border border-base-300"
        >
          <li className="px-3 py-2 border-b border-base-200 mb-1 pointer-events-none">
            <div className="flex flex-col items-start gap-0 p-0">
              <span className="font-bold text-sm truncate w-full">
                {user.name || "Account"}
              </span>
              <span className="text-[11px] opacity-60 truncate w-full">
                {user.email}
              </span>
            </div>
          </li>
          <li>
            <Link href="/">
              <LuStore /> Visit Storefront
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <LuSettings /> Account Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => logoutRef.current.showModal()}
              className="text-error hover:bg-error hover:text-error-content"
            >
              <LuLogOut /> Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserDropdown;
