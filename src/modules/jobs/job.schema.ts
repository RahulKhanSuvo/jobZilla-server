import { z } from "zod";

export const JobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
]);
export const CareerLevelEnum = z.enum([
  "ENTRY_LEVEL",
  "MID_LEVEL",
  "SENIOR_LEVEL",
  "EXECUTIVE_LEVEL",
]);
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "ANY"]);
export const SalaryTypeEnum = z.enum(["MONTHLY", "YEARLY", "HOURLY"]);
export const LocationTypeEnum = z.enum(["REMOTE", "ON_SITE", "HYBRID"]);
export const JobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  category: z.string().min(1, "Job category is required"),
  gender: GenderEnum,
  salaryType: SalaryTypeEnum,
  salaryMin: z.coerce.number().int().min(1, "Salary min is required"),
  salaryMax: z.coerce.number().int().min(1, "Salary max is required"),
  jobType: JobTypeEnum,
  locationType: LocationTypeEnum,
  location: z.string().min(1, "Location is required"),
  experience: z.string().max(100).min(1, "Experience is required"),
  careerLevel: CareerLevelEnum,
  qualification: z.string().min(1, "Qualification is required"),
  deadline: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().refine((date) => date > new Date(), {
      message: "Deadline must be a future date",
    }),
  ),
});

export const JobStatusSchema = z.enum(["OPEN", "CLOSED", "PUBLISHED"]);
export const UpdateJobStatusSchema = z.object({
  status: JobStatusSchema,
});
export type IJob = z.infer<typeof JobSchema>;
export type IJobStatus = z.infer<typeof JobStatusSchema>;

export const JobUpdateSchema = JobSchema.partial();
