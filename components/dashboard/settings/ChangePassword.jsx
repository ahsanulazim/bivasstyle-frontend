"use client";

import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import { passwordValidator } from "@/validators/passwordValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff, LuKeyRound, LuLock } from "react-icons/lu";
import { toast } from "react-toastify";
import SettingsCard from "./SettingsCard";

const ChangePassword = () => {
  const { newUser } = useContext(MyContext);
  const isGoogleUser = Boolean(newUser?.user?.isGoogle);

  const [isHidden, setIsHidden] = useState({
    currentPass: true,
    newPass: true,
    confirmPass: true,
  });

  const handleTogglePassword = (fieldName) => {
    setIsHidden((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const { Subscribe, handleSubmit, reset, Field } = useForm({
    defaultValues: {
      currentPass: "",
      newPass: "",
      confirmPass: "",
    },
    validators: {
      onChange: passwordValidator,
      onSubmit: passwordValidator,
    },
    onSubmit: async ({ value }) => {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        value.currentPass,
      );
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, value.newPass);
        toast.success("Password changed successfully");
        reset();
      } catch (error) {
        toast.error("Current password is incorrect");
      }
    },
  });

  return (
    <SettingsCard
      title="Security & Password"
      subtitle="Keep your account secure with a strong password."
      icon={LuLock}
    >
      {isGoogleUser ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/60 border border-base-300 text-xs">
          <FcGoogle className="size-7 shrink-0" />
          <div>
            <p className="font-bold text-sm">Signed in with Google</p>
            <p className="opacity-70 mt-0.5">
              Your account is authenticated securely via Google Sign-In (
              {newUser?.user?.email}). Password management is handled directly
              by your Google Account.
            </p>
          </div>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field name="currentPass">
            {(field) => {
              const { errors } = field.state.meta;
              return (
                <div className="fieldset">
                  <label htmlFor={field.name} className="label text-xs font-semibold">
                    Current Password
                  </label>
                  <label htmlFor={field.name} className="input input-bordered w-full flex items-center gap-2">
                    <LuKeyRound className="opacity-50 size-4 shrink-0" />
                    <input
                      type={isHidden.currentPass ? "password" : "text"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter current password"
                      className="grow text-sm"
                    />
                    <button
                      type="button"
                      className="cursor-pointer opacity-60 hover:opacity-100"
                      onClick={() => handleTogglePassword("currentPass")}
                    >
                      {isHidden.currentPass ? <LuEye /> : <LuEyeOff />}
                    </button>
                  </label>
                  {errors.length > 0 && (
                    <p className="text-error text-xs mt-1">{errors[0]?.message}</p>
                  )}
                </div>
              );
            }}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field name="newPass">
              {(field) => {
                const { errors } = field.state.meta;
                return (
                  <div className="fieldset">
                    <label htmlFor={field.name} className="label text-xs font-semibold">
                      New Password
                    </label>
                    <label htmlFor={field.name} className="input input-bordered w-full flex items-center gap-2">
                      <LuLock className="opacity-50 size-4 shrink-0" />
                      <input
                        type={isHidden.newPass ? "password" : "text"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="New password"
                        className="grow text-sm"
                      />
                      <button
                        type="button"
                        className="cursor-pointer opacity-60 hover:opacity-100"
                        onClick={() => handleTogglePassword("newPass")}
                      >
                        {isHidden.newPass ? <LuEye /> : <LuEyeOff />}
                      </button>
                    </label>
                    {errors.length > 0 && (
                      <p className="text-error text-xs mt-1">{errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </Field>

            <Field name="confirmPass">
              {(field) => {
                const { errors } = field.state.meta;
                return (
                  <div className="fieldset">
                    <label htmlFor={field.name} className="label text-xs font-semibold">
                      Confirm New Password
                    </label>
                    <label htmlFor={field.name} className="input input-bordered w-full flex items-center gap-2">
                      <LuLock className="opacity-50 size-4 shrink-0" />
                      <input
                        type={isHidden.confirmPass ? "password" : "text"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Confirm new password"
                        className="grow text-sm"
                      />
                      <button
                        type="button"
                        className="cursor-pointer opacity-60 hover:opacity-100"
                        onClick={() => handleTogglePassword("confirmPass")}
                      >
                        {isHidden.confirmPass ? <LuEye /> : <LuEyeOff />}
                      </button>
                    </label>
                    {errors.length > 0 && (
                      <p className="text-error text-xs mt-1">{errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </Field>
          </div>

          <div className="flex justify-end pt-1">
            <Subscribe
              children={({ canSubmit, isSubmitting, isDirty }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                  className="btn btn-sm btn-main px-5"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>{" "}
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              )}
            />
          </div>
        </form>
      )}
    </SettingsCard>
  );
};

export default ChangePassword;
