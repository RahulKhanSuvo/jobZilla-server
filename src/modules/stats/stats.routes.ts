import { Router } from "express";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { statsController } from "./statsController.controller";

const statsRoutes = Router();

statsRoutes.get(
  "/employer/job-stats",
  authGard({ roles: [UserRole.EMPLOYER] }),
  statsController.getJobStats,
);

export default statsRoutes;
