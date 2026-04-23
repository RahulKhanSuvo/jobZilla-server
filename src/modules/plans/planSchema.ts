import { z } from "zod";

const createPlanSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  maxPostings: z.number(),
  features: z.array(z.string()),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  currency: z.enum(["USD", "EUR", "BDT"]),
  duration: z.string().optional(),
  isActive: z.boolean(),
  isHighlight: z.boolean(),
  stripeProductId: z.string(),
  stripePriceId: z.string(),
});

export const PlanSchema = {
  createPlanSchema,
};

export type IPlan = z.infer<typeof createPlanSchema>;
