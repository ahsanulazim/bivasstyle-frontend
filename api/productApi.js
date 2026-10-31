import { api } from "@/axios/axiosInstance";

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

  if (filters.minPrice) query.set("minPrice", filters.minPrice);
  if (filters.maxPrice) query.set("maxPrice", filters.maxPrice);
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
