import Filter from "@/components/product/Filter";
import ShopNav from "@/components/product/ShopNav";
import Spinner from "@/components/skeleton/Spinner";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const formattedCategory = (category || "Collection")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedCategory} Collection`,
    description: `Shop our premium ${formattedCategory} collection at Bivas Style. Ethical craftsmanship, elegant Muslim fashion, and fast delivery across Bangladesh.`,
    alternates: {
      canonical: `/products/${category}`,
    },
    openGraph: {
      title: `${formattedCategory} Collection | Bivas Style`,
      description: `Shop our premium ${formattedCategory} collection at Bivas Style. Ethical craftsmanship and authentic quality.`,
      url: `/products/${category}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${formattedCategory} Collection | Bivas Style`,
      description: `Shop our premium ${formattedCategory} collection at Bivas Style.`,
    },
  };
}

const page = async ({ params }) => {
  const { category } = await params;

  return (
    <>
      <ShopNav category={category} />
      <Suspense fallback={<Spinner />}>
        <Filter category={category} />
      </Suspense>
    </>
  );
};

export default page;
