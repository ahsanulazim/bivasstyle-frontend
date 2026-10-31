"use client";

import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import AddRateForm from "@/components/dashboard/shipping/AddRateForm";
import ShippingData from "@/components/dashboard/shipping/ShippingData";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const Shipping = () => {
  const rateRef = useRef(null);

  return (
    <>
      <AddRateForm ref={rateRef} />
      <Breadcrumbs title="Shipping" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Shipping</h2>
          <button
            onClick={() => rateRef.current.showModal()}
            className="btn btn-main"
          >
            <LuPlus /> Add Rates
          </button>
        </div>
      </section>
      <section>
        <ShippingData />
      </section>
    </>
  );
};

export default Shipping;
