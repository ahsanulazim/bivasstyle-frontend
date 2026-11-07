import { api } from "@/axios/axiosInstance";

export const uploadProductImages = async (files) => {
  const formData = new FormData();
  if (Array.isArray(files)) {
    files.forEach((file) => formData.append("images", file));
  } else {
    formData.append("images", files);
  }
  const res = await api.post("/products/uploadImages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post("/products/createProduct", productData);
  return res.data;
};

export const updateProduct = async ({ id, productData }) => {
  const res = await api.put(`/products/updateProduct?id=${id}`, productData);
  return res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/getProductBySlug?slug=${slug}`);
  return res.data;
};

export const getAllProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getAllProducts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const getNewArrivals = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getNewArrivals`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/deleteProduct/?id=${id}`);
  return res.data;
};

export const toggleProductFeatured = async (id) => {
  const res = await api.patch(`/products/toggleFeatured?id=${id}`);
  return res.data;
};

export const quickUpdateProductStock = async ({ id, stock, color, size }) => {
  const res = await api.patch(`/products/quickStock?id=${id}`, {
    stock,
    color,
    size,
  });
  return res.data;
};

export const bulkUpdateProducts = async ({ action, ids, payload }) => {
  const res = await api.post("/products/bulkUpdate", {
    action,
    ids,
    payload,
  });
  return res.data;
};

// lib/api/filters.js
export async function fetchFilters(category) {
  const cat = category || "all";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getCategoryFilters/?category=${cat}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch filters");
  }

  return res.json();
}

// get products by filters
export const getProductsByFilters = async (
  category,
  page,
  limit,
  filters = {},
) => {
  const query = new URLSearchParams({
    category: category || "all",
    page: page || 1,
    limit: limit || 12,
  });

  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== "") query.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== "") query.set("maxPrice", filters.maxPrice);
  if (filters.sizes) query.set("sizes", filters.sizes);
  if (filters.colors) query.set("colors", filters.colors);
  if (filters.stock) query.set("stock", filters.stock);
  if (filters.sort) query.set("sort", filters.sort);
  if (filters.search) query.set("search", filters.search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getProductsByFilters/?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

// Live search products
export const searchProductsApi = async (query) => {
  if (!query || !query.trim()) return [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/search?q=${encodeURIComponent(query.trim())}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) return [];
  return res.json();
};
