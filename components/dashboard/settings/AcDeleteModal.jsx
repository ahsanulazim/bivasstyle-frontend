"use client";

import { api } from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import { useForm } from "@tanstack/react-form-nextjs";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { LuEye, LuEyeOff, LuTriangleAlert } from "react-icons/lu";
import { toast } from "react-toastify";

const AcDeleteModal = ({ ref }) => {
  const [isHidden, setIsHidden] = useState(false);
  const { newUser, loading, setNewUser } = useContext(MyContext);
  const [authentication, setAuthentication] = useState(false);

  const router = useRouter();

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      retypePass: "",
    },
    onSubmit: async ({ value }) => {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        value.retypePass,
      );
      try {
        await reauthenticateWithCredential(user, credential);
        await api.delete("/users/deleteUser", {
          params: {
            email: user.email,
          },
        });
        await deleteUser(user);
        toast.success("Account has been closed");
        setNewUser(null);
        reset();
        ref.current.close();
        router.push("/");
      } catch (error) {
        console.log(error.response.data.message);
        toast.error("Failed to close account");
      }
    },
  });

  const deactivateGoogle = async () => {
    setAuthentication(true);
    const google = new GoogleAuthProvider();
    try {
      await reauthenticateWithPopup(auth.currentUser, google);
      await api.delete("/users/deleteUser", {
        params: {
          email: newUser?.user?.email,
        },
      });
      toast.success("Account has been closed");
      setNewUser(null);
      ref.current.close();
      router.push("/");
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Failed to close account");
    } finally {
      setAuthentication(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <div className="flex items-center gap-2 font-bold text-lg text-red-600">
          <LuTriangleAlert />
          <span>Close Account</span>
        </div>
        <p className="py-4">
          Are you sure you want to close your account permanently?
        </p>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : newUser?.user?.isGoogle ? (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={deactivateGoogle}
              className="btn bg-white text-black border-[#e5e5e5]"
            >
              {authentication ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <svg
                    aria-label="Google logo"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <path d="m0 0H512V512H0" fill="#fff"></path>
                      <path
                        fill="#34a853"
                        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                      ></path>
                      <path
                        fill="#4285f4"
                        d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                      ></path>
                      <path
                        fill="#fbbc02"
                        d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                      ></path>
                      <path
                        fill="#ea4335"
                        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                      ></path>
                    </g>
                  </svg>
                  Re-authenticate with Google
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => ref.current.close()}
              className="btn btn-error ml-3"
            >
              Leave
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="mb-3">
              <Field
                name="retypePass"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Password is required" : undefined,
                  onSubmit: ({ value }) =>
                    !value ? "Password is required" : undefined,
                }}
              >
                {(field) => {
                  const { errors } = field.state.meta;
                  const {
                    name,
                    handleChange,
                    handleBlur,
                    state: { value },
                  } = field;
                  return (
                    <>
                      <label htmlFor={name} className="label">
                        <span>Write your password to confirm</span>
                      </label>
                      <label
                        htmlFor={name}
                        className={`input w-full focus-within:outline-none focus:outline-none ${errors[0]?.message && "border border-red-600"}`}
                      >
                        <input
                          type={isHidden ? "text" : "password"}
                          placeholder="******"
                          name={name}
                          value={value}
                          onBlur={handleBlur}
                          onChange={(e) => handleChange(e.target.value)}
                        />

                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => setIsHidden(!isHidden)}
                        >
                          {isHidden ? <LuEye /> : <LuEyeOff />}
                        </button>
                      </label>
                      {errors.length > 0 && (
                        <span className="text-red-600">
                          {errors[0]?.message}
                        </span>
                      )}
                    </>
                  );
                }}
              </Field>
            </div>

            <div className="flex items-center gap-5">
              <Subscribe>
                {({ canSubmit, isSubmitting, isDirty }) => (
                  <button
                    type="submit"
                    className="btn btn-error flex-1"
                    disabled={!canSubmit || isSubmitting || !isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Deactivating
                      </>
                    ) : (
                      "Deactivate Account"
                    )}
                  </button>
                )}
              </Subscribe>
              <button
                type="button"
                onClick={() => ref.current.close()}
                className="btn flex-1"
              >
                Leave
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default AcDeleteModal;
