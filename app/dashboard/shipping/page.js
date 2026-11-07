"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import AddRateForm from "@/components/dashboard/shipping/AddRateForm";
import GlobalFlatRateCard from "@/components/dashboard/shipping/GlobalFlatRateCard";
import ShippingData from "@/components/dashboard/shipping/ShippingData";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Shipping = () => {
  const rateRef = useRef(null);

  return (
    <>
      <AddRateForm ref={rateRef} />
      <Breadcrumbs title="Shipping" />
      <section className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Shipping Settings &amp; Rates</h2>
          <button
            onClick={() => rateRef.current.showModal()}
            className="btn btn-main"
          >
            <LuPlus /> Add Courier Rate
          </button>
        </div>
      </section>

      {/* Global Flat Rate Configuration */}
      <GlobalFlatRateCard />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Courier &amp; District Rates</h3>
          <span className="text-xs text-base-content/60">
            Configure rates per courier, region, or set individual flat rates.
          </span>
        </div>
        <ShippingData />
      </section>
    </>
  );
};

export default Shipping;
