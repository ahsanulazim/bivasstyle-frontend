"use client";

import { updateShippingRate } from "@/api/shippingApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

const EditRateModal = ({ rate, onClose }) => {
  const { locations, locationsLoading } = useContext(MyContext);
  const [logoPreview, setLogoPreview] = useState(rate?.companyLogo || "");

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: rate?.companyName || "",
      companyLogo: rate?.companyLogo || "",
      location: rate?.location || [],
      rateType: rate?.rateType || (rate?.isFlatRate ? "flat" : "weight_based"),
      baseCharge: rate?.baseCharge ?? "",
      extraCharge: rate?.extraCharge ?? 0,
      weightLimit: rate?.weightLimit ?? 1,
      status: rate?.status ? "true" : "false",
    },
  });

  const rateType = watch("rateType");
  const isFlatRate = rateType === "flat";

  useEffect(() => {
    if (rate) {
      reset({
        companyName: rate?.companyName || "",
        companyLogo: rate?.companyLogo || "",
        location: rate?.location || [],
        rateType:
          rate?.rateType || (rate?.isFlatRate ? "flat" : "weight_based"),
        baseCharge: rate?.baseCharge ?? "",
        extraCharge: rate?.extraCharge ?? 0,
        weightLimit: rate?.weightLimit ?? 1,
        status: rate?.status ? "true" : "false",
      });
      setLogoPreview(rate?.companyLogo || "");
    }
  }, [rate, reset]);

  const locationOptions = locationsLoading
    ? [{ value: "", label: "Loading...", isDisabled: true }]
    : [
        { value: "all", label: "All Areas / Bangladesh (Any Area)" },
        ...(locations?.map((location) => ({
          value: location?.id,
          label: location?.name?.en,
        })) || []),
      ];

  const convertBase64 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("companyLogo", reader.result, { shouldValidate: true });
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: updateShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Shipping rate updated successfully");
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update rate");
    },
  });

  const onSubmit = (data) => {
    mutate({
      id: rate._id,
      ...data,
      isFlatRate,
      rateType: isFlatRate ? "flat" : "weight_based",
      baseCharge: Number(data.baseCharge),
      extraCharge:
        isFlatRate || data.extraCharge === "" || isNaN(Number(data.extraCharge))
          ? 0
          : Number(data.extraCharge),
      weightLimit: isFlatRate ? 0 : Number(data.weightLimit || 0),
      status: data.status === "true" || data.status === true,
    });
  };

  if (!rate) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="font-bold text-xl">Edit Shipping Rate</h2>

          <label htmlFor="companyName" className="label">
            Company Name
          </label>
          <input
            type="text"
            {...register("companyName", {
              required: "Company Name is required",
            })}
            className="input w-full"
            placeholder="Steadfast"
          />
          {errors.companyName && (
            <span className="text-red-600">{errors.companyName.message}</span>
          )}

          <label htmlFor="companyLogo" className="label">
            Company Logo
          </label>
          {logoPreview && (
            <div className="mb-2">
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={120}
                height={40}
                className="rounded border border-base-300 p-1 object-contain max-h-12 w-auto"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={convertBase64}
            className="file-input w-full"
          />
          {errors.companyLogo && (
            <span className="text-red-600">{errors.companyLogo.message}</span>
          )}

          <label htmlFor="location" className="label">
            Location
          </label>
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Locations"
                options={locationOptions}
                isMulti
              />
            )}
          />
          {errors.location && (
            <span className="text-red-600">{errors.location.message}</span>
          )}

          <label className="label font-semibold">Rate System</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-base-200 rounded-lg">
            <button
              type="button"
              onClick={() => setValue("rateType", "weight_based")}
              className={`btn btn-sm ${
                !isFlatRate ? "btn-primary" : "btn-ghost"
              }`}
            >
              Weight Based
            </button>
            <button
              type="button"
              onClick={() => setValue("rateType", "flat")}
              className={`btn btn-sm ${
                isFlatRate ? "btn-primary" : "btn-ghost"
              }`}
            >
              Flat Rate (Any Weight)
            </button>
          </div>

          {isFlatRate && (
            <div className="alert alert-info py-2 px-3 text-xs bg-info/10 text-info border border-info/20 rounded-lg my-1">
              <span>
                <strong>Flat Rate Active:</strong> This fixed charge will apply to all orders for the selected locations regardless of weight. Extra weight charges are disabled.
              </span>
            </div>
          )}

          <label htmlFor="baseCharge" className="label">
            {isFlatRate ? "Flat Shipping Fee (৳)" : "Base Charge (৳)"}
          </label>
          <input
            type="number"
            {...register("baseCharge", {
              required: isFlatRate
                ? "Flat Shipping Fee is required"
                : "Base Charge is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Charge must be greater than 0",
              },
            })}
            className="input w-full"
            placeholder={isFlatRate ? "100" : "100"}
          />
          {errors.baseCharge && (
            <span className="text-red-600">{errors.baseCharge.message}</span>
          )}

          {!isFlatRate && (
            <>
              <label htmlFor="extraCharge" className="label">
                Extra Charge per additional KG (৳)
              </label>
              <input
                type="number"
                {...register("extraCharge", {
                  required: false,
                  setValueAs: (v) =>
                    v === "" || v === null || isNaN(Number(v)) ? 0 : Number(v),
                  min: {
                    value: 0,
                    message: "Extra Charge cannot be negative",
                  },
                })}
                className="input w-full"
                placeholder="20"
              />
              {errors.extraCharge && (
                <span className="text-red-600">{errors.extraCharge.message}</span>
              )}

              <label htmlFor="weightLimit" className="label">
                Base Weight Limit (KG)
              </label>
              <input
                type="number"
                step={0.1}
                {...register("weightLimit", {
                  required: !isFlatRate ? "Weight Limit is required" : false,
                  valueAsNumber: true,
                  min: {
                    value: 0.1,
                    message: "Weight Limit must be at least 0.1KG",
                  },
                })}
                className="input w-full"
                placeholder="1"
              />
              {errors.weightLimit && (
                <span className="text-red-600">{errors.weightLimit.message}</span>
              )}
            </>
          )}

          <label htmlFor="status" className="label">
            Status
          </label>
          <div className="flex items-center gap-5">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                className="radio"
                {...register("status")}
                value="true"
              />
              <label htmlFor="status">Active</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                className="radio"
                {...register("status")}
                value="false"
              />
              <label htmlFor="status">Inactive</label>
            </div>
          </div>
          {errors.status && (
            <span className="text-red-600">{errors.status.message}</span>
          )}

          <div className="flex gap-3 mt-5">
            <button
              className="btn btn-success flex-1"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span> Updating...
                </>
              ) : (
                "Update Rate"
              )}
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EditRateModal;

