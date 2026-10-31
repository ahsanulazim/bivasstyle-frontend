export const createCategory = async (categoryData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/category/createCategory`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    },
  );
  return res.json();
};

export const getAllCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/category/getAllCategories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};
