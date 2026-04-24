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

const getSinglePlan = async (id: string) => {
  const result = await prisma.plan.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updatePlan = async (id: string, data: Partial<IPlan>) => {
  const result = await prisma.plan.update({
    where: { id },
    data,
  });
  return result;
};

const deletePlan = async (id: string) => {
  const result = await prisma.plan.delete({
    where: { id },
  });
  return result;
};

export const PlanService = {
  createPlan,
  getAllPlans,
  getSinglePlan,
  updatePlan,
  deletePlan,
};
