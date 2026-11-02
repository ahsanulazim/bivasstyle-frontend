"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const DashboardPage = () => {
  const { newUser, loading } = useContext(MyContext);

  // Wait for auth to resolve so admins don't see a flash of the customer view
  if (loading || !newUser) return null;

  return newUser?.user?.role === "admin" ? (
    <AdminDashboard />
  ) : (
    <CustomerDashboard />
  );
};

export default DashboardPage;
