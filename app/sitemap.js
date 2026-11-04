export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bivasstyle.com";

  let productRoutes = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getAllProducts`,
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        productRoutes = products
          .filter((p) => p?.slug && p?.category)
          .map((p) => ({
            url: `${baseUrl}/products/${p.category}/${p.slug}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          }));
      }
    }
  } catch (err) {
    console.error("Sitemap product fetch error:", err);
  }

  const categoryRoutes = ["kurti", "three-piece", "two-piece", "saree"].map(
    (cat) => ({
      url: `${baseUrl}/products/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }),
  );

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

