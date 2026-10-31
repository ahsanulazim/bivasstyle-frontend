import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ShopNav from "@/components/product/ShopNav";

export const generateMetaData = async ({ params }) => {
  const { product } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getProductBySlug/?slug=${product}`,
  );

  if (!res.ok) return { title: "Product Not Found" };
  const productData = await res.json();

  // Search Engine Meta Headers setup Injection
  return {
    title: `${productData?.productName} | Oiki Lifestyle`,
    description:
      productData?.description ||
      `Buy ${productData?.productName} at the best price online.`,
    openGraph: {
      title: productData?.productName,
      description: productData?.description,
      images: [
        {
          url:
            productData?.variantDetails[0]?.imageGallery[0] ||
            "/default-product.jpg",
          width: 800,
          height: 600,
        },
      ],
    },
  };
};

const page = async ({ params }) => {
  const { product } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getProductBySlug/?slug=${product}`,
    {
      method: "GET",
    },
  );

  const productData = await res.json();

  if (!productData) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <ShopNav category={productData?.category} product={productData} />
      <ProductInfo product={productData} />
      <ProductTabs product={productData} />
    </>
  );
};

export default page;
