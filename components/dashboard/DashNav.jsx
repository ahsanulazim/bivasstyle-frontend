"use client";

import Link from "next/link";
import UserDropdown from "./UserDropdown";
import Image from "next/image";
import { useSocket } from "@/context/SocketProvider";

const DashNav = () => {
  const { isConnected } = useSocket();

  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="flex-1 flex items-center gap-2">
        <label
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
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
            className="my-1.5 inline-block size-4"
          >
            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
            <path d="M9 4v16"></path>
            <path d="M14 10l2 2l-2 2"></path>
          </svg>
        </label>
        <Link href="/dashboard">
          <Image
            src="/assets/oiki-logo.svg"
            alt="oiki logo"
            width={60}
            height={28}
            className=""
          />
        </Link>
      </div>
      <div className="flex-none flex items-center gap-3">
        <UserDropdown />
      </div>
    </header>
  );
};

export default DashNav;
