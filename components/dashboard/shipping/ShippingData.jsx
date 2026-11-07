"use client";

import { deleteShippingRate } from "@/api/shippingApi";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import EditRateModal from "./EditRateModal";

const ShippingData = () => {
  const { shippingRates, shippingRatesLoading } = useContext(MyContext);
  const [editingRate, setEditingRate] = useState(null);
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Shipping rate deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete rate");
    },
  });

  const confirmDelete = (rate) => {
    if (
      window.confirm(
        `Are you sure you want to delete shipping rate for ${rate.companyName}?`,
      )
    ) {
      handleDelete(rate._id);
    }
  };

  return (
    <div className="my-5">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr className="bg-base-200">
              <th>Company</th>
              <th>Rate Type</th>
              <th>Location</th>
              <th>Base / Flat Fee</th>
              <th>Extra Charge</th>
              <th>Weight Limit</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shippingRatesLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <span className="loading loading-spinner"></span> Loading shipping rates...
                </td>
              </tr>
            ) : !shippingRates || shippingRates.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-base-content/60">
                  No shipping rates found. Click &quot;Add Courier Rate&quot; to create one.
                </td>
              </tr>
            ) : (
              shippingRates.map((rate) => {
                const isFlat = Boolean(
                  rate.isFlatRate || rate.rateType === "flat",
                );
                return (
                  <tr key={rate._id} className="hover">
                    <td>
                      {rate.companyLogo ? (
                        <div className="flex items-center gap-3">
                          <Image
                            src={rate.companyLogo}
                            alt={rate.companyName || "Company logo"}
                            width={80}
                            height={30}
                            className="object-contain max-h-8 w-auto rounded"
                          />
                          <span className="font-semibold text-xs opacity-75">
                            {rate.companyName}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">{rate.companyName}</span>
                      )}
                    </td>
                    <td>
                      {isFlat ? (
                        <span className="badge badge-primary badge-sm font-medium">
                          Flat Rate
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm opacity-75">
                          Weight Based
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm">
                        {Array.isArray(rate.location)
                          ? rate.location.map((item) => item.label).join(", ")
                          : "N/A"}
                      </span>
                    </td>
                    <td className="font-semibold">
                      <TakaSymbol /> {rate.baseCharge}
                    </td>
                    <td>
                      {isFlat ? (
                        <span className="text-xs text-base-content/50 italic">
                          None (Flat)
                        </span>
                      ) : (
                        <>
                          <TakaSymbol /> {rate.extraCharge || 0} / KG
                        </>
                      )}
                    </td>
                    <td>
                      {isFlat ? (
                        <span className="text-xs text-base-content/50 italic">
                          No limit
                        </span>
                      ) : (
                        `${rate.weightLimit || 1} KG`
                      )}
                    </td>
                    <td>
                      <div
                        className={`badge badge-soft ${
                          rate?.status
                            ? "border-success badge-success"
                            : "border-error badge-error"
                        }`}
                      >
                        <div className="inline-grid *:[grid-area:1/1]">
                          <div
                            className={`status animate-ping ${
                              rate?.status ? "status-success" : "status-error"
                            }`}
                          ></div>
                          <div
                            className={`status ${
                              rate?.status ? "status-success" : "status-error"
                            }`}
                          ></div>
                        </div>
                        <span className="ml-1">
                          {rate?.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRate(rate)}
                        className="btn btn-circle btn-sm btn-soft btn-info"
                        title="Edit Rate"
                      >
                        <LuSquarePen className="size-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(rate)}
                        disabled={isDeleting}
                        className="btn btn-circle btn-sm btn-soft btn-error"
                        title="Delete Rate"
                      >
                        <LuTrash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      {editingRate && (
        <EditRateModal
          rate={editingRate}
          onClose={() => setEditingRate(null)}
        />
      )}
    </div>
  );
};

export default ShippingData;
