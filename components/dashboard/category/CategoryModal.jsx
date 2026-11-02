"use client";

import { createCategory, updateCategory } from "@/api/categoryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LuCloudUpload, LuPlus, LuSave, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const CategoryModalForm = ({
  category = null,
  isEditing = false,
  onClose,
  modalRef,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(isEditing && category ? category.name || "" : "");
  const [slug, setSlug] = useState(isEditing && category ? category.slug || "" : "");
  const [thumbnail, setThumbnail] = useState(
    isEditing && category ? category.coverThumbnail || null : null,
  );
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update category");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleClose = () => {
    setName("");
    setSlug("");
    setThumbnail(null);
    setErrors({});
    modalRef?.current?.close();
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      thumbnail,
    };

    if (isEditing && category?._id) {
      updateMutation.mutate({ id: category._id, categoryData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="modal-box max-w-lg p-6 rounded-3xl border border-base-300 bg-base-100 shadow-2xl relative">
      <button
        type="button"
        onClick={handleClose}
        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
      >
        <LuX className="size-4" />
      </button>

      <h3 className="font-bold text-xl mb-1">
        {isEditing ? "Edit Category" : "Add New Category"}
      </h3>
      <p className="text-xs opacity-60 mb-5">
        {isEditing
          ? "Update category details and cover image."
          : "Organize products into custom taxonomy for storefront browsing."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label text-xs font-semibold">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Traditional Panjabi"
            className={`input input-bordered w-full text-sm rounded-xl ${
              errors.name ? "input-error" : ""
            }`}
          />
          {errors.name && (
            <span className="text-xs text-error mt-1 block">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label className="label text-xs font-semibold">
            Slug (URL friendly)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="e.g. traditional-panjabi"
            className={`input input-bordered w-full text-sm rounded-xl font-mono ${
              errors.slug ? "input-error" : ""
            }`}
          />
          {errors.slug && (
            <span className="text-xs text-error mt-1 block">
              {errors.slug}
            </span>
          )}
        </div>

        <div>
          <label className="label text-xs font-semibold">
            Category Thumbnail / Banner
          </label>
          {thumbnail ? (
            <div className="relative mt-1 rounded-2xl border border-base-300 overflow-hidden bg-base-200/50 p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt="Category preview"
                className="max-h-48 w-auto rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() => setThumbnail(null)}
                className="btn btn-sm btn-circle btn-error absolute top-3 right-3 shadow-md"
                title="Remove image"
              >
                <LuTrash2 className="size-4" />
              </button>
            </div>
          ) : (
            <label
              className="border-2 border-dashed border-base-300 hover:border-main bg-base-200/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition"
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="size-12 rounded-2xl bg-main/10 text-main flex items-center justify-center mb-2">
                <LuCloudUpload className="size-6" />
              </div>
              <p className="text-xs font-semibold text-center">
                Drag & drop or <span className="text-main">browse image</span>
              </p>
              <p className="text-[10px] opacity-60 text-center mt-0.5">
                PNG, JPG, WEBP up to 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="btn btn-ghost btn-sm rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-main btn-sm rounded-xl gap-1.5"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Saving...
              </>
            ) : isEditing ? (
              <>
                <LuSave className="size-4" /> Update Category
              </>
            ) : (
              <>
                <LuPlus className="size-4" /> Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const CategoryModal = ({
  modalRef,
  category = null,
  isEditing = false,
  onClose,
}) => {
  const formKey = (isEditing ? "edit" : "create") + "-" + (category?._id || "new");

  return (
    <dialog ref={modalRef} className="modal">
      <CategoryModalForm
        key={formKey}
        category={category}
        isEditing={isEditing}
        onClose={onClose}
        modalRef={modalRef}
      />
    </dialog>
  );
};

export default CategoryModal;
