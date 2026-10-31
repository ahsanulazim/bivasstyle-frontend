import Filter from "@/components/product/Filter";
import ShopNav from "@/components/product/ShopNav";
import Spinner from "@/components/skeleton/Spinner";
import { Suspense } from "react";

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
