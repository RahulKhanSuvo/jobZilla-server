import { Router } from "express";
import { PlanController } from "./plan.controller";
import { authGard } from "../../middleware/authGard";
import { validate } from "../../middleware/validate.middleware";
import { PlanSchema } from "./planSchema";

const planRoute = Router();

planRoute.post(
  "/",
  authGard({ roles: ["ADMIN"] }),
  validate(PlanSchema.createPlanSchema),
  PlanController.createPlan,
);

planRoute.get(
  "/admin/all-plans",
  authGard({ roles: ["ADMIN"] }),
  PlanController.getAllPlans,
);

export default planRoute;
