import { z } from "zod";

const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "SHORTLISTED"]),
});

const createApplicationSchema = z.object({
  jobId: z.string(),
  resumeId: z.string().optional(),
});

export const ApplicationSchema = {
  updateApplicationStatusSchema,
  createApplicationSchema,
};
