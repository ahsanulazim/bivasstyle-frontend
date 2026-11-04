import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ShopNav from "@/components/product/ShopNav";

export const generateMetadata = async ({ params }) => {
  const { category, product } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getProductBySlug/?slug=${product}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return { title: "Product Not Found" };
    const productData = await res.json();

    const imageUrl =
      productData?.variantDetails?.[0]?.imageGallery?.[0] ||
      productData?.variantDetails?.[0]?.swatchImage ||
      productData?.productImages?.[0] ||
      "/assets/logo.svg";

    const title = productData?.productName ? `${productData.productName}` : "Product Details";
    const description =
      productData?.description?.slice(0, 160) ||
      `Buy authentic ${productData?.productName || "products"} online at Bivas Style with fast delivery across Bangladesh.`;

    const productUrl = `/products/${category || productData?.category || "all"}/${product}`;

    return {
      title,
      description,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: `${productData?.productName || "Product"} | Bivas Style`,
        description,
        url: productUrl,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: productData?.productName || "Product Image",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${productData?.productName || "Product"} | Bivas Style`,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Product | Bivas Style" };
  }
};

const page = async ({ params }) => {
  const { category, product } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getProductBySlug/?slug=${product}`,
    {
      method: "GET",
      next: { revalidate: 60 },
    },
  );

  const productData = await res.json();

  if (!productData) {
    return <div>Product not found</div>;
  }

  const firstVariant = productData?.variantDetails?.[0];
  const price =
    firstVariant?.sizes?.[0]?.discount ||
    firstVariant?.sizes?.[0]?.price ||
    firstVariant?.discount ||
    firstVariant?.price ||
    productData?.discount ||
    productData?.price ||
    0;

  const inStock = Boolean(
    productData?.hasVariants !== false && Array.isArray(productData?.variantDetails)
      ? productData.variantDetails.some((v) =>
          Array.isArray(v.sizes) && v.sizes.length > 0
            ? v.sizes.some((s) => s.stock > 0)
            : Number(v.stock) > 0,
        )
      : Number(productData?.stock || 0) > 0,
  );

  const images = (
    firstVariant?.imageGallery?.length
      ? firstVariant.imageGallery
      : productData?.productImages?.length
        ? productData.productImages
        : [firstVariant?.swatchImage].filter(Boolean)
  ).filter(Boolean);

  const productUrl = `https://bivasstyle.com/products/${category || productData?.category || "all"}/${product}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData?.productName,
    description: productData?.description || `${productData?.productName} by Bivas Style`,
    image: images.length > 0 ? images : ["https://bivasstyle.com/assets/logo.svg"],
    sku: productData?._id,
    brand: {
      "@type": "Brand",
      name: "Bivas Style",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopNav category={productData?.category} product={productData} />
      <ProductInfo product={productData} />
      <ProductTabs product={productData} />
    </>
  );
};

export default page;
