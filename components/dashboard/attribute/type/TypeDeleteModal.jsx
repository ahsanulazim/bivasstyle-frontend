"use client";
import { deleteVariation } from "@/api/typeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TypeDeleteModal = ({ ref, id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteVariation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variations"] });
      toast.success("Variation Deleted");
    },
    onError: () => {
      toast.error("Variation Cannot be Deleted");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Variation?</h3>
        <p className="py-4">This will permanently delete this variation.</p>
        <div className="modal-action">
          <form method="dialog" className="w-full gap-3 flex">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="button"
              className="btn btn-error flex-1"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(id)}
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Delete"
              )}
            </button>
            <button className="btn flex-1">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default TypeDeleteModal;
