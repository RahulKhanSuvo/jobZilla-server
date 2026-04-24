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

planRoute.get("/:id", PlanController.getSinglePlan);

planRoute.patch(
  "/:id",
  authGard({ roles: ["ADMIN"] }),
  PlanController.updatePlan,
);

planRoute.delete(
  "/:id",
  authGard({ roles: ["ADMIN"] }),
  PlanController.deletePlan,
);

export default planRoute;
