"use client";

import { createShippingRate } from "@/api/shippingApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

const AddRateForm = ({ ref }) => {
  const { locations, locationsLoading } = useContext(MyContext);

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "",
      companyLogo: "",
      location: [],
      baseCharge: "",
      extraCharge: "",
      weightLimit: "",
      status: true,
    },
  });

  const locationOptions = locationsLoading
    ? [{ value: "", label: "Loading...", isDisabled: true }]
    : [
        { value: "all", label: "All Except Selected" },
        ...(locations?.map((location) => ({
          value: location?.id,
          label: location?.name?.en,
        })) || []),
      ];

  const convertBase24 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("companyLogo", reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Rate added successfully");
      reset();
      ref.current.close();
    },
    onError: () => {
      toast.error("Failed to add rate");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="font-bold text-xl">Add Rate</h2>
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => convertBase24(e)}
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
                placeholder="Dhaka"
                options={locationOptions}
                isMulti
              />
            )}
          />
          {errors.location && (
            <span className="text-red-600">{errors.location.message}</span>
          )}

          <label htmlFor="baseCharge" className="label">
            Base Charge
          </label>
          <input
            type="number"
            {...register("baseCharge", {
              required: "Base Charge is required",
              valueAsNumber: true,
              min: {
                value: 50,
                message: "Base Charge must be at least 50TK",
              },
            })}
            className="input w-full"
            placeholder="100"
          />
          {errors.baseCharge && (
            <span className="text-red-600">{errors.baseCharge.message}</span>
          )}

          <label htmlFor="extraCharge" className="label">
            Extra Charge
          </label>
          <input
            type="number"
            {...register("extraCharge", {
              required: false,
              valueAsNumber: true,
              min: {
                value: 10,
                message: "Extra Charge must be at least 10TK",
              },
            })}
            className="input w-full"
            placeholder="20"
          />
          {errors.extraCharge && (
            <span className="text-red-600">{errors.extraCharge.message}</span>
          )}

          <label htmlFor="weightLimit" className="label">
            Weight Limit
          </label>
          <input
            type="number"
            step={0.1}
            {...register("weightLimit", {
              required: "Weight Limit is required",
              valueAsNumber: true,
              min: {
                value: 0.5,
                message: "Weight Limit must be at least 0.5KG",
              },
            })}
            className="input w-full"
            placeholder="1"
          />
          {errors.weightLimit && (
            <span className="text-red-600">{errors.weightLimit.message}</span>
          )}

          <label htmlFor="status" className="label">
            Status
          </label>
          <div className="flex items-center gap-5">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                className="radio"
                {...register("status", {
                  setValueAs: (val) => val === "true" || val === true,
                })}
                value="true"
              />
              <label htmlFor="status">Active</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                className="radio"
                {...register("status", {
                  setValueAs: (val) => val === "true" || val === true,
                })}
                value="false"
              />
              <label htmlFor="status">Inactive</label>
            </div>
          </div>
          {errors.status && (
            <span className="text-red-600">{errors.status.message}</span>
          )}

          <button
            className="btn btn-success mt-5"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={() => {
              ref.current.close();
              reset();
            }}
          >
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddRateForm;
