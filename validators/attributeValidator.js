import z from "zod";

export const attributeValidator = z.object({
  name: z
    .string()
    .min(1, "Attribute name is required")
    .min(3, "Attribute name must be at least 3 characters long"),
  slug: z.string().min(1, "Attribute slug is required"),
  variations: z
    .array(z.string().min(1, "Variation value is required"))
    .min(1, "Attribute variations are required"),
});
