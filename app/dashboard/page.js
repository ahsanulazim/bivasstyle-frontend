"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const page = () => {
  const { newUser, loading } = useContext(MyContext);

  return (
    <>
      {!loading && newUser?.user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </>
  );
};

export default page;
