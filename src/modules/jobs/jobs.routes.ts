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
// save job
jobsRoutes.post(
  "/save-job",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  jobsController.saveJob,
);

// get save job
jobsRoutes.get(
  "/save-job",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  jobsController.getSaveJob,
);

// unsave job
jobsRoutes.delete(
  "/save-job/:id",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  jobsController.unSaveJob,
);

// get job by id
jobsRoutes.get("/:id", authGard({ optional: true }), jobsController.jobById);

export default jobsRoutes;
