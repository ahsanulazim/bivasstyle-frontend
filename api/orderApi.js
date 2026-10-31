import { api } from "@/axios/axiosInstance";

export const createOrder = async (data) => {
  const res = await api.post("/orders/createOrder", data);
  return res.data;
};

export const getAllOrderData = async () => {
  const res = await api.get("/orders/getAllOrderData");
  return res.data;
};

export const getOrderDetails = async (orderId) => {
  const res = await api.get(`/orders/getOrderDetails?orderId=${orderId}`);
  return res.data;
};

export const getUserOrders = async ({ userId, email }) => {
  const res = await api.get("/orders/myOrders", {
    params: { userId, email },
  });
  return res.data;
};

export const trackPublicOrder = async (query) => {
  const res = await api.get("/orders/trackPublicOrder", {
    params: { query },
  });
  return res.data;
};

export const updateOrder = async (data) => {
  const res = await api.put("/orders/updateOrder", data);
  return res.data;
};

export const sendOrderToCourier = async (orderId) => {
  const res = await api.post("/orders/sendToCourier", { orderId });
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/deleteOrder?id=${id}`);
  return res.data;
};
