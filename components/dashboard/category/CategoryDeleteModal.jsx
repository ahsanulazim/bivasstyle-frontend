"use client";

import { deleteCategory } from "@/api/categoryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const CategoryDeleteModal = ({ modalRef, category, onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      modalRef?.current?.close();
      onClose?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete category");
    },
  });

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-sm rounded-3xl p-6 border border-base-300 bg-base-100 shadow-2xl">
        <div className="size-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-3">
          <LuTriangleAlert className="size-6" />
        </div>
        <h3 className="font-bold text-lg">Delete Category?</h3>
        <p className="text-xs opacity-70 mt-1">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-base-content">
            {category?.name || "this category"}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="modal-action flex items-center gap-2 mt-5">
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1 rounded-xl"
            disabled={mutation.isPending}
            onClick={() => {
              modalRef?.current?.close();
              onClose?.();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error btn-sm flex-1 rounded-xl gap-1.5"
            disabled={mutation.isPending}
            onClick={() => {
              if (category?._id) mutation.mutate(category._id);
            }}
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Deleting...
              </>
            ) : (
              <>
                <LuTrash2 className="size-4" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CategoryDeleteModal;

