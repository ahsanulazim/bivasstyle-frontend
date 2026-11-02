"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({ children, href, dataTip, exact = false }) => {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
        isActive ? "menu-active bg-main! text-white! font-semibold" : ""
      }`}
      data-tip={dataTip}
    >
      {/* icon */}
      {children}
    </Link>
  );
};

export default ActiveLink;
