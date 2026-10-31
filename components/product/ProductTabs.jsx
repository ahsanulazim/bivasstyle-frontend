"use client";

import {
  createReview,
  deleteReview,
  getProductReviews,
} from "@/api/reviewApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import parse from "html-react-parser";
import moment from "moment";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { LuBadgeCheck, LuCamera, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const ProductTabs = ({ product }) => {
  const { newUser } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState(newUser?.user?.name || "");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);

  const description = product?.productDescription
    ? product.productDescription.replace(/\u00A0/g, " ")
    : "No description available.";

  const { data: reviewData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", product?.slug],
    queryFn: () =>
      getProductReviews({
        slug: product?.slug,
        productId: product?._id,
      }),
    enabled: Boolean(product?.slug || product?._id),
  });

  const reviews = reviewData?.reviews || [];
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (res) => {
      toast.success(res.message || "Review submitted!");
      queryClient.invalidateQueries({ queryKey: ["reviews", product?.slug] });
      setComment("");
      setPhotos([]);
      setRating(5);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", product?.slug] });
    },
  });

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => [...prev, ev.target.result].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.warning("Please write a short review comment");
    }
    createMutation.mutate({
      productId: product?._id,
      productSlug: product?.slug,
      userName: userName.trim() || newUser?.user?.name || "Valued Customer",
      userEmail: newUser?.user?.email || "",
      rating,
      comment,
      images: photos,
    });
  };

  return (
    <section className="my-10 px-5">
      <div className="max-w-360 mx-auto w-full">
        <div className="tabs tabs-lift">
          <input
            type="radio"
            name="product_detail_tabs"
            className="tab font-semibold"
            aria-label="Description"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 wrap-break-word whitespace-normal">
            {parse(description)}
          </div>

          <input
            type="radio"
            name="product_detail_tabs"
            className="tab font-semibold"
            aria-label={`Customer Reviews (${reviews.length})`}
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Write a Review Form */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-box bg-base-200/60 flex items-center gap-4">
                  <div className="text-center pr-4 border-r border-base-300">
                    <p className="text-3xl font-bold text-main">
                      {averageRating}
                    </p>
                    <div className="flex items-center justify-center text-warning text-xs my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar key={s} />
                      ))}
                    </div>
                    <p className="text-[11px] opacity-60">
                      {reviews.length} Review(s)
                    </p>
                  </div>
                  <div className="text-xs space-y-1 opacity-80">
                    <p className="font-semibold">Share Your Experience</p>
                    <p>
                      Bought this outfit? Upload a photo and help other shoppers
                      choose the right fit and color!
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-3 border border-base-300 p-4 rounded-box"
                >
                  <h4 className="font-bold text-sm">Write a Customer Review</h4>

                  <div>
                    <label className="label text-xs">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-xl cursor-pointer transition-transform hover:scale-110"
                        >
                          <FaStar
                            className={
                              star <= rating
                                ? "text-warning"
                                : "text-base-300"
                            }
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold ml-2">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label text-xs">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="input input-sm input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label text-xs">Your Review</label>
                    <textarea
                      rows={3}
                      placeholder="How was the fabric quality, stitching, and size fit?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="textarea textarea-bordered w-full text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="label text-xs">
                      Add Photos (Optional, up to 3)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {photos.map((img, i) => (
                        <div
                          key={i}
                          className="relative size-14 rounded-lg overflow-hidden border border-base-300"
                        >
                          <img
                            src={img}
                            alt="upload preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPhotos((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                            className="btn btn-xs btn-circle btn-error absolute top-0.5 right-0.5 size-4 min-h-0"
                          >
                            <LuX className="size-2.5" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 3 && (
                        <label className="size-14 rounded-lg border border-dashed border-base-300 flex flex-col items-center justify-center cursor-pointer hover:border-main text-xs opacity-70 hover:opacity-100">
                          <LuCamera className="size-4" />
                          <span className="text-[10px]">Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="btn btn-sm btn-main w-full"
                  >
                    {createMutation.isPending ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </div>

              {/* Right: Customer Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-bold text-base">
                  Customer Feedback ({reviews.length})
                </h4>
                {reviewsLoading ? (
                  <div className="py-8 text-center">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-base-300 rounded-box opacity-60 text-sm">
                    No reviews yet for this outfit. Be the first to share your
                    review!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="p-4 rounded-box border border-base-200 bg-base-100 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">
                                {rev.userName}
                              </span>
                              {rev.verifiedPurchase && (
                                <span className="badge badge-xs badge-success badge-soft gap-1">
                                  <LuBadgeCheck className="size-3" /> Verified
                                  Buyer
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex text-warning text-xs">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <FaStar
                                    key={s}
                                    className={
                                      s <= Number(rev.rating)
                                        ? "text-warning"
                                        : "text-base-300"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] opacity-50">
                                {moment(rev.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>

                          {newUser?.user?.role === "admin" && (
                            <button
                              type="button"
                              onClick={() => deleteMutation.mutate(rev._id)}
                              className="btn btn-xs btn-ghost btn-circle text-error"
                              title="Delete review (Admin)"
                            >
                              <LuTrash2 />
                            </button>
                          )}
                        </div>

                        <p className="text-sm opacity-85">{rev.comment}</p>

                        {Array.isArray(rev.images) && rev.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {rev.images.map((imgUrl, idx) => (
                              <a
                                key={idx}
                                href={imgUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="size-16 rounded-lg overflow-hidden border border-base-300 block hover:opacity-90"
                              >
                                <img
                                  src={imgUrl}
                                  alt="customer review"
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <input
            type="radio"
            name="product_detail_tabs"
            className="tab font-semibold"
            aria-label="Fabric & Wash Care"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 space-y-3 text-sm">
            <h4 className="font-bold text-base">
              Craftsmanship &amp; Care Instructions
            </h4>
            <ul className="list-disc list-inside space-y-1.5 opacity-80">
              <li>
                <strong>Wash Care:</strong> Gentle hand wash separately in cold
                water with mild liquid detergent, or dry clean for
                silk/embroidered ethnic wear.
              </li>
              <li>
                <strong>Drying:</strong> Do not wring or tumble dry. Dry in
                shade to preserve natural dye vibrancy.
              </li>
              <li>
                <strong>Ironing:</strong> Warm iron on reverse side; use a
                pressing cloth for delicate embroidery or zari work.
              </li>
              <li>
                <strong>Bleaching:</strong> Do not bleach or soak for prolonged
                periods.
              </li>
            </ul>
          </div>

          <input
            type="radio"
            name="product_detail_tabs"
            className="tab font-semibold"
            aria-label="Return & Exchange Policy"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 space-y-3 text-sm">
            {product?.returnPolicy ? (
              <p>{product.returnPolicy}</p>
            ) : (
              <div className="space-y-2 opacity-80">
                <p>
                  <strong>Easy 3-Day Size Exchange &amp; Return:</strong> Check
                  your parcel in front of the delivery rider. If there is any
                  size issue, defect, or wrong item delivered, you can return it
                  immediately or request an exchange within{" "}
                  <strong>3 days</strong> of delivery.
                </p>
                <p>
                  Items must be unused, unwashed, and in their original
                  packaging with tags intact. Read our full{" "}
                  <Link
                    href="/return-policy"
                    className="link text-main font-semibold"
                  >
                    Return &amp; Exchange Policy
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
