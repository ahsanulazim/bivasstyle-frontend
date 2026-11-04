"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { FB_PIXEL_ID, initFbcCookie, pageview } from "@/lib/fpixel";

function FacebookPixelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Capture fbclid query parameter if present
    initFbcCookie();

    // Skip the first render because the initial pageview is triggered by the base pixel script
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger pageview on subsequent client-side route transitions
    pageview();
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixel() {
  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {/* Global Site Code Pixel - Meta Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <FacebookPixelTracking />
      </Suspense>
    </>
  );
}
