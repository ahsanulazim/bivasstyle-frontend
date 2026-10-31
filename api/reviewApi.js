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

