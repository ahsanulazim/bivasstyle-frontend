"use client";
import { createAttribute, updateAttribute } from "@/api/attributeApi";
import { attributeValidator } from "@/validators/attributeValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const AddAttributeModalTwo = ({ ref, isEditing, attribute }) => {
  const { Field, Subscribe, reset, handleSubmit, setFieldValue } = useForm({
    defaultValues: {
      name: isEditing ? attribute.name : "",
      slug: isEditing ? attribute.slug : "",
      variations: isEditing ? attribute.variations : [],
    },
    onSubmit: ({ value }) =>
      isEditing
        ? updateMutation.mutate({ attributeData: value, id: attribute._id })
        : addMutation.mutate(value),
    validators: {
      onSubmit: attributeValidator,
    },
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Attribute Added");
      reset();
      ref.current.close();
    },
    onError: (data) => {
      toast.error(data.message || "Attribute Cannot be Added");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Attribute Updated");
      reset();
      ref.current.close();
    },
    onError: (data) => {
      toast.error(data.message || "Attribute Cannot be Updated");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs uppercase tracking-wider">
            Define Custom Product Attributable Variation
          </h4>
          <button
            onClick={() => {
              ref.current.close();
              reset();
            }}
            className="btn btn-error btn-square btn-sm btn-soft"
          >
            <LuX />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          className="fieldset"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              name="name"
              children={(field) => {
                const { errors } = field.state.meta;

                return (
                  <div>
                    <label className="label" htmlFor={field.name}>
                      Attribute Display Name
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setFieldValue(
                          "slug",
                          e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        );
                      }}
                      value={field.state.value}
                      placeholder="e.g. Storage Capacity"
                      className="input w-full"
                    />
                    {errors.length > 0 && (
                      <p className="text-red-500">{errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            />
            <Field
              name="slug"
              children={(field) => {
                const { errors } = field.state.meta;
                return (
                  <div>
                    <label className="label" htmlFor={field.name}>
                      Slug
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                      placeholder="e.g. storage-capacity"
                      className="input w-full"
                    />
                    {errors.length > 0 && (
                      <span className="text-error">{errors[0]?.message}</span>
                    )}
                  </div>
                );
              }}
            />
          </div>

          <Field
            name="variations"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Variation Values (Comma separated)
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    onBlur={(e) => {
                      field.handleBlur();
                      setFieldValue(
                        field.name,
                        e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter((v) => v.length > 0),
                      );
                    }}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setFieldValue(
                        field.name,
                        e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter((v) => v.length > 0),
                      );
                    }}
                    value={field.state.value}
                    placeholder="e.g. 128GB, 256GB, 512GB, 1TB"
                    className="input w-full"
                  />
                  {errors.length > 0 && (
                    <span className="text-error">{errors[0]?.message}</span>
                  )}
                  <span className="label whitespace-normal">
                    Specify the allowed option configurations separated with
                    commas (they will translate to selectors in catalog setup
                    cards).
                  </span>
                </>
              );
            }}
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                ref.current.close();
                reset();
              }}
              className="btn"
            >
              Cancel
            </button>
            <Subscribe
              children={() => (
                <button
                  type="submit"
                  className="btn btn-main"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {addMutation.isPending || updateMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : isEditing ? (
                    <>
                      <LuPlus /> Update Attribute
                    </>
                  ) : (
                    <>
                      <LuPlus /> Add Attribute
                    </>
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddAttributeModalTwo;
