import z from "zod";

export const attributeValidator = z.object({
  name: z
    .string()
    .min(1, "Attribute name is required")
    .min(2, "Attribute name must be at least 2 characters long"),
  slug: z.string().min(1, "Attribute slug is required"),
  type: z.string().optional(),
  variations: z
    .array(
      z.union([
        z.string().min(1, "Variation value is required"),
        z.object({
          name: z.string().min(1, "Name is required"),
          value: z.string().min(1, "Value is required"),
          swatchImage: z.string().nullable().optional(),
        }),
      ]),
    )
    .min(1, "At least one variation value is required"),
});
