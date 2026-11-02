"use client";

import Link from "next/link";
import {
  LuCircleHelp,
  LuExternalLink,
  LuHeadphones,
  LuMail,
  LuRotateCcw,
  LuShieldCheck,
  LuTruck,
} from "react-icons/lu";
import SettingsCard from "../settings/SettingsCard";

const CustomerSupportCard = () => {
  return (
    <SettingsCard title="Help & Support" icon={LuHeadphones}>
      <div className="space-y-3 text-xs">
        <p className="opacity-75">
          Need help with your order, return, or exchange? We are here to assist you.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/track-order"
            className="flex items-center gap-2 p-2 bg-base-200/60 rounded-xl hover:bg-base-200 border border-base-300 transition-colors"
          >
            <LuTruck className="size-4 text-main shrink-0" />
            <span className="font-semibold text-[11px] truncate">Track Order</span>
          </Link>

          <Link
            href="/return-policy"
            className="flex items-center gap-2 p-2 bg-base-200/60 rounded-xl hover:bg-base-200 border border-base-300 transition-colors"
          >
            <LuRotateCcw className="size-4 text-main shrink-0" />
            <span className="font-semibold text-[11px] truncate">Return Policy</span>
          </Link>
        </div>

        <div className="border-t border-base-200 pt-3 flex flex-col gap-2">
          <a
            href="mailto:support@bivasstyle.com"
            className="flex items-center justify-between text-xs opacity-80 hover:opacity-100 hover:text-main transition-colors"
          >
            <span className="flex items-center gap-2">
              <LuMail className="size-3.5 text-main" />
              support@bivasstyle.com
            </span>
            <LuExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </SettingsCard>
  );
};

export default CustomerSupportCard;
