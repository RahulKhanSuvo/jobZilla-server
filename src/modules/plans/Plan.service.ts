import { prisma } from "../../lib/prisma";
import { stripe } from "../../utils/stripe";
import { IPlan } from "./planSchema";

const createPlan = async (data: IPlan) => {
  const product = await stripe.products.create({
    name: data.name,
    description: data.description,
    metadata: {
      maxPostings: data.maxPostings.toString(),
    },
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: data.price * 100,
    currency: data.currency,
  });
  const result = await prisma.plan.create({
    data: {
      ...data,
      stripeProductId: product.id,
      stripePriceId: price.id,
    },
  });
  return result;
};

const getAllPlans = async () => {
  const result = await prisma.plan.findMany();
  return result;
};

export const PlanService = {
  createPlan,
  getAllPlans,
};
