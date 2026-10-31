import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import OrderData from "@/components/dashboard/orders/OrderData";
import Link from "next/link";
import { LuPlus, LuSearch } from "react-icons/lu";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Orders" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Orders</h2>
          <Link href="/dashboard/orders/create-order" className="btn btn-main">
            <LuPlus /> Create Order
          </Link>
        </div>
      </section>
      <section>
        <OrderData />
      </section>
    </>
  );
};

export default page;
