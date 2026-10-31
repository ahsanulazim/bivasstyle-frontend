import { auth } from "@/firebase/firebase.config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { toast } from "react-toastify";

const LogoutModal = ({ ref }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        toast.success("Logged Out");
        router.push("/login");
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <FaTriangleExclamation className="text-error" /> Confirm Logout
        </h3>
        <p className="py-4">Are you sure you want to logout?</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="button"
              className="btn btn-error"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Logout"
              )}
            </button>
            <button type="submit" className="btn btn-outline ml-5">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default LogoutModal;
