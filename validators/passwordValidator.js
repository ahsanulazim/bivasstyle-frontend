import z from "zod";
const passwordValidator = z
  .object({
    currentPass: z.string().min(1, "Current password is required"),
    newPass: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPass: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPass === data.confirmPass, {
    message: "Passwords do not match",
    path: ["confirmPass"],
  });

export { passwordValidator };

export const profileValidator = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email"),
});
