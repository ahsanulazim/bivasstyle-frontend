import { api } from "@/axios/axiosInstance";

export const getProductReviews = async ({ slug, productId }) => {
  const res = await api.get("/reviews/product", {
    params: { slug, productId },
  });
  return res.data;
};

export const createReview = async (reviewData) => {
  const res = await api.post("/reviews/create", reviewData);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/delete?id=${id}`);
  return res.data;
};

export const deleteReviewAdmin = deleteReview;

export const getAllReviewsAdmin = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/reviews/all?${query}` : `/reviews/all`;
  const res = await api.get(url);
  return res.data;
};

export const toggleReviewApproval = async (id) => {
  const res = await api.patch(`/reviews/toggleStatus?id=${id}`);
  return res.data;
};
