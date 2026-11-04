import { api } from "@/axios/axiosInstance";

export const getAllShippingRates = async () => {
  const res = await api.get("/shippingRates/getAllShippingRates");
  return res.data;
};

export const createShippingRate = async (shippingData) => {
  const res = await api.post("/shippingRates/createShippingRate", shippingData);
  return res.data;
};

export const getShippingRateByDistrict = async (district) => {
  const res = await api.get(
    `/shippingRates/getShippingRateByDistrict?district=${district}`,
  );
  return res.data;
};

export const updateShippingRate = async ({ id, ...shippingData }) => {
  const res = await api.put(
    `/shippingRates/updateShippingRate?id=${id}`,
    shippingData,
  );
  return res.data;
};

export const deleteShippingRate = async (id) => {
  const res = await api.delete(
    `/shippingRates/deleteShippingRate?id=${id}`,
  );
  return res.data;
};
