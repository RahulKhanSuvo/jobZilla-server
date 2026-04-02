import { z } from "zod";

export const JobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "FREELANCE",
  "CONTRACT",
  "INTERN",
  "REMOTE",
]);

export const JobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  category: z.string().min(1, "Job category is required"),
  tags: z.array(z.string()).min(1, "Job tags are required"),
  gender: z.string().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
  applyEmail: z.string().email().optional().nullable(),
  salaryType: z.string().optional().nullable(),
  salaryMin: z.coerce.number().int().optional().nullable(),
  salaryMax: z.coerce.number().int().optional().nullable(),
  jobType: JobTypeEnum.optional().nullable(),
  experience: z.string().max(100).optional().nullable(),
  careerLevel: z.string().optional().nullable(),
  qualification: z.string().optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  skills: z.string().max(200).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  applyType: z.string().optional().nullable(),
});

export type IJob = z.infer<typeof JobSchema>;

export const JobUpdateSchema = JobSchema.partial();
