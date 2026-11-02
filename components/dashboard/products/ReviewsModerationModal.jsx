"use client";

import {
  deleteReview,
  getAllReviewsAdmin,
  toggleReviewApproval,
} from "@/api/reviewApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import {
  LuBadgeCheck,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuMessageSquare,
  LuSearch,
  LuStar,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const ReviewsModerationModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [ratingFilter, setRatingFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminReviews", ratingFilter, searchQuery],
    queryFn: () =>
      getAllReviewsAdmin({
        rating: ratingFilter !== "all" ? ratingFilter : "",
        search: searchQuery,
      }),
    enabled: isOpen,
  });

  const reviews = data?.reviews || [];

  const toggleMutation = useMutation({
    mutationFn: toggleReviewApproval,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      toast.success(res.message || "Review status updated");
    },
    onError: () => toast.error("Failed to update review status"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      toast.success("Review deleted successfully");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-6 rounded-3xl border border-base-300 bg-base-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <LuX className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
            <LuMessageSquare className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Product Reviews Moderation</h3>
            <p className="text-xs text-base-content/60">
              Review customer feedback, approve ratings, and moderate spam.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-base-200/50 rounded-2xl">
          <label className="input input-sm rounded-xl flex items-center gap-2 grow max-w-xs bg-base-100">
            <LuSearch className="size-3.5 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviewer or comment..."
              className="text-xs grow"
            />
          </label>

          <div className="flex items-center gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="select select-sm rounded-xl text-xs bg-base-100"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List Table */}
        <div className="overflow-y-auto grow space-y-3 pr-1">
          {isLoading ? (
            <div className="py-12 text-center">
              <span className="loading loading-spinner text-main" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-60">
              No customer reviews found matching criteria.
            </div>
          ) : (
            reviews.map((rev) => {
              const isHidden = rev.status === "hidden";
              return (
                <div
                  key={rev._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isHidden
                      ? "bg-base-200/40 border-base-300 opacity-60"
                      : "bg-base-100 border-base-300 shadow-xs"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="badge badge-xs badge-success gap-1 font-semibold">
                          <LuBadgeCheck className="size-3" /> Verified Buyer
                        </span>
                      )}
                      <span className="text-[11px] opacity-60">
                        {rev.productSlug && `on ${rev.productSlug}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Rating Stars */}
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <LuStar
                            key={i}
                            className={`size-3.5 ${
                              i < rev.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-base-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] opacity-50">
                        {moment(rev.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-base-content/80 leading-relaxed mb-3">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-base-200/60">
                    <span
                      className={`badge badge-xs font-semibold ${
                        isHidden ? "badge-neutral" : "badge-success badge-soft"
                      }`}
                    >
                      {isHidden ? "Hidden from Store" : "Approved & Live"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMutation.mutate(rev._id)}
                        disabled={toggleMutation.isPending}
                        className={`btn btn-xs gap-1 text-xs ${
                          isHidden ? "btn-outline btn-success" : "btn-ghost"
                        }`}
                        title={isHidden ? "Publish Review" : "Hide Review"}
                      >
                        {isHidden ? (
                          <>
                            <LuEye className="size-3" /> Approve
                          </>
                        ) : (
                          <>
                            <LuEyeOff className="size-3" /> Hide
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to permanently delete this review?",
                            )
                          ) {
                            deleteMutation.mutate(rev._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="btn btn-xs btn-ghost btn-circle text-error"
                        title="Delete Review"
                      >
                        <LuTrash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="modal-action pt-3 border-t border-base-200">
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            Close
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />
    </div>
  );
};

export default ReviewsModerationModal;
