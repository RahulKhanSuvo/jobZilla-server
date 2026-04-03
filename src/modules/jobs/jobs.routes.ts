import { Router } from "express";
import { jobsController } from "./jobs.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { JobSchema } from "./job.schema";
import { validate } from "../../middleware/validate.middleware";

const jobsRoutes = Router();

jobsRoutes.get("/", authGard({ optional: true }), jobsController.getAllJobs);
jobsRoutes.get(
  "/my-jobs",
  authGard({ roles: [UserRole.EMPLOYER] }),
  jobsController.getMyJobs,
);

jobsRoutes.post(
  "/",
  authGard({ roles: [UserRole.EMPLOYER] }),
  validate(JobSchema),
  jobsController.createJob,
);
jobsRoutes.get("/:id", authGard({ optional: true }), jobsController.jobById);
// save job
jobsRoutes.post(
  "/save-job",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  jobsController.saveJob,
);

export default jobsRoutes;
