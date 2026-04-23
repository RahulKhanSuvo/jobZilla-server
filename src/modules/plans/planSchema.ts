import { z } from "zod";

const createPlanSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  duration: z.string(),
  type: z.enum(["MONTHLY", "YEARLY"]),
  isActive: z.boolean(),
});

export const PlanSchema = {
  createPlanSchema,
};

export type IPlan = z.infer<typeof createPlanSchema>;
