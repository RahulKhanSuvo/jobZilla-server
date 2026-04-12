import { z } from "zod";

const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "SHORTLISTED"]),
});

export const ApplicationSchema = {
  updateApplicationStatusSchema,
};
