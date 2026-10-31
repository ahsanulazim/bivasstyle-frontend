import { createCategory } from "@/api/categoryApi";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCloudUpload, LuPlus, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import z from "zod";

const CategoryModal = ({ ref }) => {
  const { handleSubmit, reset, Field, Subscribe, setFieldValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      thumbnail: null,
    },
    onSubmit: ({ value }) => console.log(value),
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name is required"),
        slug: z
          .string()
          .min(1, "Slug is required")
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be in lowercase and can only contain letters, numbers, and hyphens",
          ),
        thumbnail: z.any().optional(),
      }),
    },
  });

  const handleFileChange = (file) => {
    // const file = e.target.files;
    if (!file) return;
    setFieldValue("thumbnail", file);
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["categories"],
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      reset();
      ref.current.close();
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Category</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          className="fieldset"
        >
          <Field
            name="name"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Category Name
                  </label>
                  <input
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
                    type="text"
                    className="input w-full"
                    placeholder="Three Piece"
                  />
                  {errors.length > 0 && (
                    <p className="text-red-500">{errors[0]?.message}</p>
                  )}
                </>
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

          <Field
            name="thumbnail"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <label
                  className="border border-dashed border-main bg-main/5 rounded-box p-5 cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    handleFileChange({ target: { files: [file] } });
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col items-center">
                    <LuCloudUpload className="text-main size-12" />
                    <h3 className="text-sm text-center max-w-55">
                      Drag and Drop or click here to Upload Thumbnail
                    </h3>
                  </div>
                  <input
                    type="file"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    // onChange={(e) => field.handleChange(e.target.value)}
                    // value={field.state.value}
                    accept="image/*"
                    className="hidden"
                  />

                  {errors.length > 0 && (
                    <span className="text-error">{errors[0]?.message}</span>
                  )}
                </label>
              );
            }}
          />

          <Subscribe
            selector={(state) => state.values.thumbnail}
            children={(thumbnail) => {
              if (!thumbnail) return null;
              const previewUrl = URL.createObjectURL(thumbnail);

              return (
                <div className="mt-3 flex justify-center relative">
                  <button
                    type="button"
                    className="btn btn-square btn-error btn-sm absolute top-5 right-5"
                    onClick={() => {
                      setFieldValue("thumbnail", null);
                    }}
                  >
                    <LuTrash2 />
                  </button>
                  <img
                    src={previewUrl}
                    alt="thumbnail preview"
                    className="w-full rounded-lg border border-base-300"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />
                </div>
              );
            }}
          />

          <div className="mt-5 flex justify-end gap-5">
            <button
              type="button"
              onClick={() => {
                ref.current.close();
                reset();
              }}
              className="btn flex-1 btn-error"
            >
              Close
            </button>
            <Subscribe
              children={() => (
                <button type="submit" className="btn flex-1 btn-success">
                  {isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <LuPlus /> Create
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

export default CategoryModal;
