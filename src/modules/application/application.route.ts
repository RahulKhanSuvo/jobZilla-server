import { Router } from "express";
import { ApplicationController } from "./application.controller";
import { upload } from "../../middleware/upload";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { validate } from "../../middleware/validate.middleware";
import { ApplicationSchema } from "./application.schema";

const router = Router();

router.post(
  "/",
  authGard({ roles: [UserRole.CANDIDATE] }),
  upload.single("file"),
  validate(ApplicationSchema.createApplicationSchema),
  ApplicationController.createApplication,
);

router.get(
  "/",
  authGard({ roles: [UserRole.EMPLOYER] }),
  ApplicationController.getAllApplications,
);
router.get(
  "/:id",
  authGard({ roles: [UserRole.EMPLOYER] }),
  ApplicationController.getApplicationById,
);
router.patch(
  "/status/:id",
  authGard({ roles: [UserRole.EMPLOYER] }),
  validate(ApplicationSchema.updateApplicationStatusSchema),
  ApplicationController.updateApplicationStatus,
);

export const ApplicationRoutes = router;
