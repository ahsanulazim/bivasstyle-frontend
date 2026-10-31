"use client";

import { createVariation } from "@/api/typeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const TypeModal = ({ ref, type }) => {
  const typeName = type.slice(0, 1).toUpperCase() + type.slice(1, type.length);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVariation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variations"] });
      toast.success(`${typeName} created successfully`);
      reset();
      ref.current?.close();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || `Failed to create ${typeName}`,
      );
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, attributeSlug: type });
    console.log(data);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-lg font-bold">Add New {typeName}</h2>
          <label htmlFor="name" className="label">
            {typeName} Name
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("name", { required: `${typeName} Name is required` })}
            placeholder={`${typeName} Name`}
          />

          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Slug"
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-zA-Z0-9-]+$/,
                message: "Invalid slug format",
              },
            })}
          />
          <label htmlFor="value" className="label">
            {type === "color" ? "Swatch" : "Button"}
          </label>
          {type === "color" ? (
            <input
              type="color"
              className="size-10 rounded-md border-0 p-0"
              {...register("value", {
                required: `${typeName} Color is required`,
              })}
            />
          ) : (
            <input
              type="text"
              className="input w-full"
              placeholder="M"
              {...register("value", {
                required: `${typeName} Value is required`,
              })}
            />
          )}
          <button type="submit" className="btn btn-main mt-5">
            Add {typeName}
          </button>
          <button
            type="button"
            className="btn btn-otline"
            onClick={() => {
              ref.current?.close();
              reset();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default TypeModal;
