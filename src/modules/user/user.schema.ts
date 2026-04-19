import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, " name is required").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CANDIDATE", "EMPLOYER", "ADMIN"]).optional(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be 6 character"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be 6 character"),
  newPassword: z.string().min(6, "Password must be 6 character"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
