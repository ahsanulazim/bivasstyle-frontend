export const createVariation = async (variationData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/variations/createVariation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variationData),
    },
  );
  return res.json();
};

export const getAllVariationsAsType = async (type) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/variations/getAllVariationsAsType/${type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const getAllVariations = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/variations/getAllVariations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const deleteVariation = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/variations/deleteVariation/?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};
