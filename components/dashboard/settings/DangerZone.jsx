"use client";

import { useRef } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import AcDeleteModal from "./AcDeleteModal";
import SettingsCard from "./SettingsCard";

const DangerZone = () => {
  const acDeleteRef = useRef();

  return (
    <SettingsCard
      title="Danger Zone"
      subtitle="Permanent account actions."
      icon={LuTriangleAlert}
    >
      <AcDeleteModal ref={acDeleteRef} />
      <div className="p-3.5 rounded-xl bg-error/5 border border-error/20 space-y-3">
        <p className="text-xs opacity-80 leading-relaxed">
          Closing your account will permanently delete your profile, saved
          addresses, and access to your Oiki Lifestyle account.
        </p>
        <button
          type="button"
          onClick={() => acDeleteRef.current.showModal()}
          className="btn btn-sm btn-error text-white w-full sm:w-auto"
        >
          <LuTriangleAlert /> Close Account Permanently
        </button>
      </div>
    </SettingsCard>
  );
};

export default DangerZone;
