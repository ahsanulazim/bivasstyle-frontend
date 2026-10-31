import { api } from "@/axios/axiosInstance";

export const getAllUsers = async ({ queryKey }) => {
  const [_, page] = queryKey;
  const { data } = await api.get("/users/getAllUsers", { params: { page } });
  return data;
};

export const deleteUser = async (email) => {
  const res = await api.delete("/users/deleteUser", { params: { email } });
  return res.data;
};
