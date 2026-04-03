import { Router } from "express";
import { jobsController } from "./jobs.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { JobSchema } from "./job.schema";
import { validate } from "../../middleware/validate.middleware";

const jobsRoutes = Router();

jobsRoutes.get("/", jobsController.getAllJobs);
jobsRoutes.get(
  "/my-jobs",
  authGard(UserRole.EMPLOYER),
  jobsController.getMyJobs,
);

jobsRoutes.post(
  "/",
  authGard(UserRole.EMPLOYER),
  validate(JobSchema),
  jobsController.createJob,
);
jobsRoutes.get("/:id", jobsController.jobById);
// save job
jobsRoutes.post(
  "/save-job",
  authGard(UserRole.CANDIDATE),
  jobsController.saveJob,
);

export default jobsRoutes;
