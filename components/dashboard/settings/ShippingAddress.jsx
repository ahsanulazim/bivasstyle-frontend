"use client";

import { api } from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { useContext, useEffect, useState } from "react";
import { LuCheck, LuMapPin, LuSave } from "react-icons/lu";
import { toast } from "react-toastify";
import SettingsCard from "./SettingsCard";

const ShippingAddress = () => {
  const { newUser, setNewUser, locations = [] } = useContext(MyContext);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    thana: "",
    district: "",
  });

  useEffect(() => {
    const u = newUser?.user;
    if (!u) return;
    const saved = u.shippingAddress || {};
    const nameParts = (u.name || "").trim().split(" ");
    setForm({
      firstName: saved.firstName || nameParts[0] || "",
      lastName: saved.lastName || nameParts.slice(1).join(" ") || "",
      phone: saved.phone || u.phone || "",
      address: saved.address || "",
      thana: saved.thana || "",
      district: saved.district || "",
    });
  }, [newUser]);

  const hasSavedAddress = Boolean(
    newUser?.user?.shippingAddress?.address &&
      newUser?.user?.shippingAddress?.district,
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newUser?.user?.email) return;

    try {
      setIsSaving(true);
      await api.put(
        "/users/updateUser",
        {
          phone: form.phone,
          shippingAddress: form,
        },
        {
          params: { email: newUser.user.email },
        },
      );

      const updatedUserObj = {
        ...newUser,
        user: {
          ...newUser.user,
          phone: form.phone,
          shippingAddress: form,
        },
      };
      setNewUser(updatedUserObj);
      localStorage.setItem("user", JSON.stringify(updatedUserObj));
      toast.success("Default shipping address saved!");
    } catch (error) {
      toast.error("Failed to save shipping address");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsCard
      title="Default Shipping Address"
      subtitle="Auto-fills your delivery information during checkout for faster ordering."
      icon={LuMapPin}
      badge={
        hasSavedAddress ? (
          <span className="badge badge-xs badge-success badge-soft gap-1">
            <LuCheck className="size-3" /> Saved for Checkout
          </span>
        ) : null
      }
    >
      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fieldset">
            <label className="label text-xs font-semibold">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>
          <div className="fieldset">
            <label className="label text-xs font-semibold">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fieldset">
            <label className="label text-xs font-semibold">
              Recipient Phone Number
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>
          <div className="fieldset">
            <label className="label text-xs font-semibold">District</label>
            <select
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="select select-bordered w-full text-sm"
              required
            >
              <option value="">Select District</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name?.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fieldset">
            <label className="label text-xs font-semibold">
              Upazilla / Thana
            </label>
            <input
              type="text"
              placeholder="e.g. Dhanmondi, Uttara"
              value={form.thana}
              onChange={(e) => setForm({ ...form, thana: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>
          <div className="fieldset">
            <label className="label text-xs font-semibold">
              Full Street Address
            </label>
            <input
              type="text"
              placeholder="House, Road, Block, Sector"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-sm btn-main gap-1.5 px-5"
          >
            {isSaving ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <LuSave className="size-4" />
            )}
            Save Shipping Address
          </button>
        </div>
      </form>
    </SettingsCard>
  );
};

export default ShippingAddress;
