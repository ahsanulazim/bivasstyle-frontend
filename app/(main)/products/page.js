import Filter from "@/components/product/Filter";
import ShopNav from "@/components/product/ShopNav";
import Spinner from "@/components/skeleton/Spinner";
import { Suspense } from "react";

export const metadata = {
  title: "Shop All Products | Oiki Lifestyle",
  description:
    "Explore our collection of ethically made handcrafted clothing, sarees, kurtis and more.",
};

const page = () => {
  return (
    <>
      <ShopNav category="all" />
      <Suspense fallback={<Spinner />}>
        <Filter category="all" />
      </Suspense>
    </>
  );
};

export default page;
