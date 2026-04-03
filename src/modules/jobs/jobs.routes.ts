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
// save job
jobsRoutes.post("/save-job");

export default jobsRoutes;
