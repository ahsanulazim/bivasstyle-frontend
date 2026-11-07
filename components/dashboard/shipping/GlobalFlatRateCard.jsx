"use client";

import { updateShippingSettings } from "@/api/shippingApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuCheck, LuInfo, LuPackageCheck, LuZap } from "react-icons/lu";
import { toast } from "react-toastify";

const GlobalFlatRateCard = () => {
  const { shippingSettings, shippingSettingsLoading } = useContext(MyContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      isGlobalFlatRateEnabled: false,
      globalFlatRateAmount: 100,
      globalFlatRateTitle: "Standard Delivery",
    },
  });

  useEffect(() => {
    if (shippingSettings) {
      reset({
        isGlobalFlatRateEnabled: Boolean(
          shippingSettings.isGlobalFlatRateEnabled,
        ),
        globalFlatRateAmount:
          shippingSettings.globalFlatRateAmount !== undefined
            ? shippingSettings.globalFlatRateAmount
            : 100,
        globalFlatRateTitle:
          shippingSettings.globalFlatRateTitle || "Standard Delivery",
      });
    }
  }, [shippingSettings, reset]);

  const isEnabled = watch("isGlobalFlatRateEnabled");

  const { mutate, isPending } = useMutation({
    mutationFn: updateShippingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingSettings"] });
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Flat rate shipping settings updated successfully");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update flat rate settings",
      );
    },
  });

  const onSubmit = (data) => {
    mutate({
      isGlobalFlatRateEnabled: data.isGlobalFlatRateEnabled,
      globalFlatRateAmount: Number(data.globalFlatRateAmount),
      globalFlatRateTitle: data.globalFlatRateTitle,
    });
  };

  return (
    <div className="card bg-base-100 border border-base-content/10 shadow-sm mb-6">
      <div className="card-body p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-base-content/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <LuZap className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Global Flat Rate System</h3>
                  {isEnabled ? (
                    <span className="badge badge-success badge-sm font-semibold gap-1">
                      <LuCheck className="size-3" /> Active
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm opacity-70">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-base-content/60">
                  Enable a single fixed delivery charge for all locations and any package weight.
                </p>
              </div>
            </div>

            <label className="label cursor-pointer flex items-center gap-3 self-start sm:self-center bg-base-200/60 px-3 py-1.5 rounded-lg border border-base-content/5">
              <span className="label-text text-sm font-medium">
                {isEnabled ? "Flat Rate Enabled" : "Flat Rate Disabled"}
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                {...register("isGlobalFlatRateEnabled")}
              />
            </label>
          </div>

          {isEnabled ? (
            <div className="mt-4 space-y-4">
              <div className="alert alert-info py-2 px-3 text-xs bg-info/10 text-info border border-info/20 rounded-lg flex items-start gap-2">
                <LuInfo className="size-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Global Flat Rate is ACTIVE:</strong> Every customer from any district in Bangladesh will be charged this flat amount regardless of weight. Custom district rates below will be bypassed while this is on.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fieldset">
                  <label htmlFor="globalFlatRateAmount" className="label text-xs font-semibold">
                    Flat Delivery Fee (৳)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="globalFlatRateAmount"
                    className="input input-sm input-bordered w-full"
                    placeholder="e.g. 100"
                    {...register("globalFlatRateAmount", {
                      required: "Flat rate amount is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Amount cannot be negative",
                      },
                    })}
                  />
                  {errors.globalFlatRateAmount && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.globalFlatRateAmount.message}
                    </span>
                  )}
                </div>

                <div className="fieldset">
                  <label htmlFor="globalFlatRateTitle" className="label text-xs font-semibold">
                    Delivery Method Name
                  </label>
                  <input
                    type="text"
                    id="globalFlatRateTitle"
                    className="input input-sm input-bordered w-full"
                    placeholder="e.g. Standard Flat Delivery"
                    {...register("globalFlatRateTitle")}
                  />
                  <span className="text-xs text-base-content/50 mt-1">
                    Customer sees this courier/delivery name during checkout.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPending || (!isDirty && !shippingSettingsLoading)}
                  className="btn btn-sm btn-primary"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <LuPackageCheck className="size-4" /> Save Flat Rate Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-base-content/60 flex items-center gap-1.5">
                <LuInfo className="size-3.5" />
                Standard district &amp; weight-based shipping rates are currently being used.
              </p>
              {isDirty && (
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-xs btn-outline btn-primary"
                >
                  {isPending ? "Saving..." : "Save Change"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GlobalFlatRateCard;

