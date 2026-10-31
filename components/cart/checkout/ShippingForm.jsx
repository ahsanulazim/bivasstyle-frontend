"use client";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useContext, useEffect } from "react";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/api/orderApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ShippingForm = ({
  ref,
  setIsPending,
  setOrderCompleted,
  paymentMethod,
}) => {
  const router = useRouter();
  const {
    locations,
    locationsLoading,
    setDeliveryAdd,
    cartItems,
    newUser,
    clearCart,
    appliedCoupon,
  } = useContext(MyContext);

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      thana: "",
      district: "",
      comment: "",
    },
  });

  // Pre-fill form if user has saved shipping address or profile details
  useEffect(() => {
    const u = newUser?.user;
    if (!u) return;
    const savedAddr = u.shippingAddress || {};
    const nameParts = (u.name || "").trim().split(" ");
    setValue("firstName", savedAddr.firstName || nameParts[0] || "");
    setValue(
      "lastName",
      savedAddr.lastName || nameParts.slice(1).join(" ") || "",
    );
    setValue("email", savedAddr.email || u.email || "");
    setValue("phone", savedAddr.phone || u.phone || "");
    if (savedAddr.address) setValue("address", savedAddr.address);
    if (savedAddr.thana) setValue("thana", savedAddr.thana);
    if (savedAddr.district) {
      setValue("district", savedAddr.district);
      setDeliveryAdd(savedAddr.district);
    }
  }, [newUser, setValue, setDeliveryAdd]);

  const districtOptions = locationsLoading
    ? [{ value: "", label: "Loading...", isDisabled: true }]
    : locations?.map((location) => ({
        value: location?.id,
        label: location?.name?.en,
      }));

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      if (paymentMethod === "cod") {
        setOrderCompleted?.(true);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        clearCart();
        toast.success("Order Placed Successfully");
        reset();
        const orderId = data?.order?._id || data?.order?.insertedId || "";
        router.push(
          `/cart/checkout/payment-success?orderId=${orderId}&method=cod`,
        );
      } else if (paymentMethod === "online") {
        if (data?.paymentUrl) {
          setOrderCompleted?.(true);
          window.location.href = data.paymentUrl;
        } else {
          toast.error("Payment URL not found");
        }
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });

  useEffect(() => {
    if (setIsPending) {
      setIsPending(isPending);
    }
  }, [isPending, setIsPending]);

  const onSubmit = (data) => {
    const orderData = {
      user: newUser ? newUser.user : "guest",
      customer: data,
      products: cartItems,
      paymentMethod,
      couponCode: appliedCoupon?.code || null,
    };

    mutate(orderData);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="fieldset">
      <div className="flex justify-baseline items-center gap-5">
        <div className="fieldset flex-1">
          <label htmlFor="firstName" className="label">
            First Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("firstName", { required: "First Name is Required" })}
          />
          {errors.firstName && (
            <p className="text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div className="fieldset flex-1">
          <label htmlFor="lastName" className="label">
            Last Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("lastName", { required: "Last Name is Required" })}
          />
          {errors.lastName && (
            <p className="text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <label htmlFor="address" className="label">
        Address<span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        className="input w-full"
        {...register("address", { required: "Address is Required" })}
      />
      {errors.address && (
        <p className="text-red-600">{errors.address.message}</p>
      )}
      <div className="flex justify-baseline items-center gap-5">
        <div className="fieldset flex-1">
          <label htmlFor="thana" className="label">
            Upazilla/Thana<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("thana", { required: "Upazilla/Thana is Required" })}
          />
          {errors.thana && (
            <p className="text-red-600">{errors.thana.message}</p>
          )}
        </div>
        <div className="fieldset flex-1">
          <label htmlFor="district" className="label">
            District<span className="text-red-600">*</span>
          </label>
          <Controller
            name="district"
            control={control}
            rules={{ required: "District is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={districtOptions}
                placeholder="Select District"
                value={
                  districtOptions?.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(selected) => {
                  field.onChange(selected.value);
                  setDeliveryAdd(selected.value);
                }}
              />
            )}
          />
          {errors.district && (
            <p className="text-red-600">{errors.district.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-baseline items-center gap-5">
        <div className="fieldset flex-1">
          <label htmlFor="phone" className="label">
            Phone<span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            className="input w-full"
            {...register("phone", { required: "Phone Number is Required" })}
          />
          {errors.phone && (
            <p className="text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="fieldset flex-1">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            className="input w-full"
            {...register("email", {
              required: false,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
      <label htmlFor="comment" className="label">
        Comment
      </label>
      <textarea
        className="textarea w-full"
        rows={5}
        {...register("comment", { required: false })}
      ></textarea>
    </form>
  );
};

export default ShippingForm;
