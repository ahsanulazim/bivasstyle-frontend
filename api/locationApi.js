export const getAllLocations = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/locations/getAllLocations`,
  );
  const data = await res.json();
  return data;
};
