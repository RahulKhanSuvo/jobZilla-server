import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string().min(1, " name is required").trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(5, "Phone number is required").trim(),
    role: z.enum(["USER", "EMPLOYER", "ADMIN"]).optional(),
    resumeUrl: z.string().url("Resume must be a valid URL").optional(),
});