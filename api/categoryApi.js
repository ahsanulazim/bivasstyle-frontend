import { api } from "@/axios/axiosInstance";

export const getAllCategories = async () => {
  const res = await api.get("/category/getAllCategories");
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post("/category/createCategory", categoryData);
  return res.data;
};

export const updateCategory = async ({ id, categoryData }) => {
  const res = await api.put(`/category/updateCategory?id=${id}`, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/deleteCategory?id=${id}`);
  return res.data;
};
