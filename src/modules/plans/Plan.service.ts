import { prisma } from "../../lib/prisma";
import { IPlan } from "./planSchema";

const createPlan = async (data: IPlan) => {
  const result = await prisma.plan.create({
    data,
  });
  return result;
};

export const PlanService = {
  createPlan,
};
