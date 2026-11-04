export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bivasstyle.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/dashboard",
          "/cart/checkout/",
          "/cart/checkout",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

