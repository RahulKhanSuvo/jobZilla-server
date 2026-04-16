import { Router } from "express";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { saveJobController } from "./saveJob.controller";

const saveJobRouter = Router();

saveJobRouter.post(
  "/",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  saveJobController.saveAJob,
);
saveJobRouter.get(
  "/",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  saveJobController.getSavedJobs,
);

export default saveJobRouter;
