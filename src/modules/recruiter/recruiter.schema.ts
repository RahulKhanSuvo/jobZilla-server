import z from "zod";

export const recruiterSchema = z.object({
  name: z.string().min(2, "Employer name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  foundedDate: z.string(),
  companySize: z.string(),
  showProfile: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .default(true)
    .optional(),
  logo: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  industry: z.string().min(1, "At least one category is required"),
  description: z
    .string()
    .min(10, "About company description is too short")
    .optional(),
  facebook: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .optional(),
  linkedin: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .optional(),
  twitter: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.string().min(1, "Location is required"),
});

export type IRecruiter = z.infer<typeof recruiterSchema>;
