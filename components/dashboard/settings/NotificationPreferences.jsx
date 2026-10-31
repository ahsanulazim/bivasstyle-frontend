"use client";

import { api } from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { useContext, useEffect, useState } from "react";
import { LuBell } from "react-icons/lu";
import { toast } from "react-toastify";
import SettingsCard from "./SettingsCard";

const NotificationPreferences = () => {
  const { newUser, setNewUser } = useContext(MyContext);
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    smsAlerts: true,
    promotionalOffers: true,
  });

  useEffect(() => {
    const saved = newUser?.user?.notificationPreferences;
    if (saved) {
      setPrefs({
        orderUpdates: saved.orderUpdates ?? true,
        smsAlerts: saved.smsAlerts ?? true,
        promotionalOffers: saved.promotionalOffers ?? true,
      });
    }
  }, [newUser]);

  const handleToggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);

    if (!newUser?.user?.email) return;
    try {
      await api.put(
        "/users/updateUser",
        { notificationPreferences: updated },
        { params: { email: newUser.user.email } },
      );
      const updatedUserObj = {
        ...newUser,
        user: {
          ...newUser.user,
          notificationPreferences: updated,
        },
      };
      setNewUser(updatedUserObj);
      localStorage.setItem("user", JSON.stringify(updatedUserObj));
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <SettingsCard
      title="Notification Preferences"
      subtitle="Control which order and promotional updates you receive."
      icon={LuBell}
    >
      <div className="space-y-3 text-xs">
        <label className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-base-200/50 cursor-pointer">
          <div>
            <p className="font-semibold text-sm">Order Status Updates</p>
            <p className="opacity-60">Dispatch & delivery timeline alerts</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-success"
            checked={prefs.orderUpdates}
            onChange={() => handleToggle("orderUpdates")}
          />
        </label>

        <label className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-base-200/50 cursor-pointer">
          <div>
            <p className="font-semibold text-sm">Courier Tracking Alerts</p>
            <p className="opacity-60">Steadfast parcel tracking updates</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-success"
            checked={prefs.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
          />
        </label>

        <label className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-base-200/50 cursor-pointer">
          <div>
            <p className="font-semibold text-sm">Coupons & Flash Sales</p>
            <p className="opacity-60">Exclusive promo codes & Eid drops</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-success"
            checked={prefs.promotionalOffers}
            onChange={() => handleToggle("promotionalOffers")}
          />
        </label>
      </div>
    </SettingsCard>
  );
};

export default NotificationPreferences;
