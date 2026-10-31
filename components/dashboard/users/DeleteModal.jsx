import { deleteUser } from "@/api/usersApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const DeleteModal = ({ ref, email }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User Deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete User</h3>
        <p className="py-4">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
        <div className="modal-action gap-5">
          <button
            className="btn btn-error flex-1"
            onClick={() => mutate(email)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner"></span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
          <button className="btn flex-1" onClick={() => ref.current.close()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal;
