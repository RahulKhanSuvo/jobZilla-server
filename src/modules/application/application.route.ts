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

export const ApplicationRoutes = router;
