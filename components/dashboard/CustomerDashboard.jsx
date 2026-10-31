"use client";
import { getUserOrders } from "@/api/orderApi";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import AccountInfo from "./customer-dashboard/AccountInfo";
import OrderOverview from "./customer-dashboard/OrderOverview";
import OrderTracking from "./customer-dashboard/OrderTracking";
import RecentOrders from "./customer-dashboard/RecentOrders";

const CustomerDashboard = () => {
  const { newUser } = useContext(MyContext);
  const userId = newUser?.user?._id;
  const email = newUser?.user?.email;

  const { data, isLoading } = useQuery({
    queryKey: ["myOrders", userId, email],
    queryFn: () => getUserOrders({ userId, email }),
    enabled: Boolean(userId || email),
  });

  const orders = data?.orders || [];
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const trackedOrder =
    orders.find((o) => o._id === selectedOrderId) || orders[0] || null;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="col-span-12 flex flex-col gap-5 md:col-span-7 lg:col-span-8">
        <OrderOverview orders={orders} />
        <RecentOrders
          orders={orders}
          isLoading={isLoading}
          selectedOrderId={trackedOrder?._id}
          onSelectOrder={(id) => setSelectedOrderId(id)}
        />
      </div>
      <div className="col-span-12 flex flex-col gap-5 md:col-span-5 lg:col-span-4">
        <OrderTracking order={trackedOrder} />
        <AccountInfo />
      </div>
    </div>
  );
};

export default CustomerDashboard;
