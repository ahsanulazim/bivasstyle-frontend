"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuAsterisk } from "react-icons/lu";

const page = () => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form className="fieldset w-full lg:max-w-sm max-lg:order-1">
      <Image
        className="mx-auto"
        src="/assets/oiki-logo-tag.svg"
        alt="Oiki Logo"
        width={80}
        height={20}
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="label">Please check your email for a verification link</p>
      </div>

      <label htmlFor="otp" className="label">
        Enter OTP
      </label>
      <label className="input w-full">
        <LuAsterisk className="h-[1em] opacity-50" />
        <input
          name="otp"
          type="number"
          placeholder="123456"
          {...register("otp", {
            required: "OTP Field is Empty",
            pattern: {
              value: /^\d{6}$/,
              message: "Invalid OTP format",
            },
          })}
        />
      </label>
      {errors.otp && <p className="text-red-600">{errors.otp.message}</p>}
      <button type="submit" className="btn btn-main mt-4">
        Verify <LuArrowRight />
      </button>
    </form>
  );
};

export default page;
