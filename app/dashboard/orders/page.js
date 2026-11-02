"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CustomerOrders from "@/components/dashboard/customer-dashboard/CustomerOrders";
import OrderData from "@/components/dashboard/orders/OrderData";
import { MyContext } from "@/context/MyProvider";
import { Suspense, useContext } from "react";

const OrdersPage = () => {
  const { newUser, loading } = useContext(MyContext);

  if (loading) {
    return (
      <div className="p-16 text-center">
        <span className="loading loading-spinner loading-md text-main"></span>
      </div>
    );
  }

  const isAdmin = newUser?.user?.role === "admin";

  if (!isAdmin) {
    return <CustomerOrders />;
  }

  return (
    <>
      <Breadcrumbs title="Orders" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl">Orders</h2>
            <p className="text-xs opacity-60">
              Search, filter and manage all customer orders.
            </p>
          </div>
        </div>
      </section>
      <section>
        <Suspense
          fallback={
            <div className="p-16 text-center">
              <span className="loading loading-spinner loading-md text-main"></span>
            </div>
          }
        >
          <OrderData />
        </Suspense>
      </section>
    </>
  );
};

export default OrdersPage;
