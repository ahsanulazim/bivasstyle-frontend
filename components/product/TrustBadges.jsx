"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { LuCoins, LuShirt, LuTruck } from "react-icons/lu";
import { FacebookShareButton } from "react-share";

const TrustBadges = () => {
  const pathname = usePathname(); // current route
  const [url, setUrl] = useState("");

  useEffect(() => {
    // ✅ Production-safe: window only available client-side
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}${pathname}`);
    }
  }, [pathname]);

  if (!url) return <p>loading...</p>;

  return (
    <div className="flex max-md:flex-col items-center xl:gap-4">
      <div className="flex xs:items-center flex-col xs:flex-row gap-5 justify-between max-lg:mb-5">
        <div className="flex max-xs:gap-3 xs:flex-col items-center">
          <div className="size-10 bg-main/10 text-main rounded-full flex items-center justify-center">
            <LuShirt />
          </div>
          <div className="xs:text-center">
            <h3 className="font-bold max-lg:text-base max-xl:text-sm whitespace-nowrap">
              100% Cotton
            </h3>
            <p className="opacity-50 text-xs xl:text-sm whitespace-nowrap">
              No Mixes no Blends
            </p>
          </div>
        </div>
        <div className="flex max-xs:gap-3 xs:flex-col items-center">
          <div className="size-10 bg-main/10 text-main rounded-full flex items-center justify-center">
            <LuCoins />
          </div>
          <div className="xs:text-center">
            <h3 className="font-bold max-lg:text-base max-xl:text-sm whitespace-nowrap">
              3 Day Guarrantee
            </h3>
            <p className="opacity-50 text-xs xl:text-sm whitespace-nowrap">
              Love it or full refund
            </p>
          </div>
        </div>
        <div className="flex max-xs:gap-3 xs:flex-col items-center">
          <div className="size-10 bg-main/10 text-main rounded-full flex items-center justify-center">
            <LuTruck />
          </div>
          <div className="xs:text-center">
            <h3 className="font-bold max-lg:text-base max-xl:text-sm whitespace-nowrap">
              Free Shipping
            </h3>
            <p className="opacity-50 text-xs xl:text-sm whitespace-nowrap">
              On orders over $50
            </p>
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div>
        <h3 className="font-bold max-md:text-center">Share:</h3>
        <div className="flex items-center gap-3 mt-2">
          <FacebookShareButton url={url}>
            <div className="btn btn-square rounded-box lg:btn-sm">
              <FaFacebook className="xl:size-4" />
            </div>
          </FacebookShareButton>
          <button className="btn btn-square rounded-box lg:btn-sm">
            <FaFacebookMessenger className="xl:size-4" />
          </button>
          <button className="btn btn-square rounded-box lg:btn-sm">
            <FaXTwitter className="xl:size-4" />
          </button>
          <button className="btn btn-square rounded-box lg:btn-sm">
            <FaWhatsapp className="xl:size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
