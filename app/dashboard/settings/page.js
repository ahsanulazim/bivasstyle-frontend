"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import Settings from "@/components/dashboard/settings/Settings";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const SettingsPage = () => {
  const router = useRouter();
  const { newUser, loading } = useContext(MyContext);

  useEffect(() => {
    if (!loading && !newUser) {
      router.push("/login");
    }
  }, [newUser, loading, router]);

  return (
    <div className="space-y-4">
      <Breadcrumbs title="Settings" />
      <Settings />
    </div>
  );
};

export default SettingsPage;
