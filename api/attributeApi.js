import { api } from "@/axios/axiosInstance";

export const createAttribute = async (attributeData) => {
  const res = await api.post("/attributes/createAttribute", attributeData);
  return res.data;
};

export const updateAttribute = async ({ attributeData, id }) => {
  const res = await api.patch("/attributes/updateAttribute", attributeData, {
    params: { id },
  });
  return res.data;
};

export const getAllAttribute = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/attributes/getAllAttributes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to get attributes");
  }

  return res.json();
};

export const deleteAttribute = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/attributes/deleteAttribute/?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Deleting Failed");
  }

  return res.json();
};
