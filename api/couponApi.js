import { api } from "@/axios/axiosInstance";

export const getAllCoupons = async () => {
  const res = await api.get("/coupons/all");
  return res.data;
};

export const getPublicCoupons = async () => {
  const res = await api.get("/coupons/public");
  return res.data;
};

export const createCoupon = async (couponData) => {
  const res = await api.post("/coupons/create", couponData);
  return res.data;
};

export const updateCoupon = async ({ id, ...couponData }) => {
  const res = await api.put(`/coupons/update?id=${id}`, couponData);
  return res.data;
};

export const toggleCouponStatus = async ({ id, field, value }) => {
  const res = await api.patch("/coupons/toggle", { id, field, value });
  return res.data;
};

export const deleteCoupon = async (id) => {
  const res = await api.delete(`/coupons/delete?id=${id}`);
  return res.data;
};

export const validateCouponCode = async (payload) => {
  const res = await api.post("/coupons/validate", payload);
  return res.data;
};

export const applyBulkProductDiscount = async (payload) => {
  const res = await api.post("/coupons/bulk-discount", payload);
  return res.data;
};
