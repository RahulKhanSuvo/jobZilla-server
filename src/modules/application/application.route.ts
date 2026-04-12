import { Router } from "express";
import { ApplicationController } from "./application.controller";
import { upload } from "../../middleware/upload";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authGard({ roles: [UserRole.CANDIDATE] }),
  upload.single("file"),
  ApplicationController.createApplication,
);

router.get(
  "/",
  authGard({ roles: [UserRole.EMPLOYER] }),
  ApplicationController.getAllApplications,
);
router.patch(
  "status/:id",
  authGard({ roles: [UserRole.EMPLOYER] }),
  ApplicationController.updateApplicationStatus,
);

export const ApplicationRoutes = router;
