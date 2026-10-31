"use client";

import AddAttributeModalTwo from "@/components/dashboard/attribute/AddAttributeModalTwo";
import AttributeTableTwo from "@/components/dashboard/attribute/AttributeTableTwo";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const attributeRef = useRef();

  return (
    <>
      <AddAttributeModalTwo isEditing={false} ref={attributeRef} />
      <Breadcrumbs title="Attributes" />
      <section className="mb-5">
        <div className="flex justify-between items-center gap-5">
          <div>
            <h2 className="font-bold text-2xl">Product Attributes</h2>
            <p className="mt-1 opacity-70">
              Manage variations parameters like size, colors or materials.
            </p>
          </div>
          <button
            className="btn btn-main"
            onClick={() => attributeRef.current.showModal()}
          >
            <LuPlus /> Add Attribute
          </button>
        </div>
      </section>
      <section>
        <AttributeTableTwo />
      </section>
    </>
  );
};

export default page;
