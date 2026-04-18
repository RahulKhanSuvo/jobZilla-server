import { z } from "zod";

export const JobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "REMOTE",
  "ON_SITE",
  "HYBRID",
]);
export const CareerLevelEnum = z.enum([
  "ENTRY_LEVEL",
  "MID_LEVEL",
  "SENIOR_LEVEL",
  "EXECUTIVE_LEVEL",
]);
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "ANY"]);
export const SalaryTypeEnum = z.enum(["MONTHLY", "YEARLY", "HOURLY"]);

export const JobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  category: z.string().min(1, "Job category is required"),
  gender: GenderEnum,
  salaryType: SalaryTypeEnum,
  salaryMin: z.coerce.number().int(),
  salaryMax: z.coerce.number().int(),
  jobType: JobTypeEnum,
  experience: z.string().max(100),
  careerLevel: CareerLevelEnum,
  qualification: z.string(),
  deadline: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().refine((date) => date >= new Date(), {
      message: "Deadline cannot be in the past",
    }),
  ),
});

export type IJob = z.infer<typeof JobSchema>;

export const JobUpdateSchema = JobSchema.partial();
