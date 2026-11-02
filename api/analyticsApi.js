import { api } from "@/axios/axiosInstance";

export const getAnalyticsSummary = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/analytics/summary?${query}` : `/analytics/summary`;
  const res = await api.get(url);
  return res.data;
};

export const downloadAnalyticsReport = async (
  type = "sales",
  range = "30d",
) => {
  const res = await api.get(`/analytics/export?type=${type}&range=${range}`, {
    responseType: "blob",
  });
  return res.data;
};
