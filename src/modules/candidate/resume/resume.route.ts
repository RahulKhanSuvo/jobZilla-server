import { Router } from "express";
import { authGard } from "../../../middleware/authGard";
import { UserRole } from "../../../generated/prisma/enums";
import { resumeController } from "./resume.controller";
import { upload } from "../../../middleware/upload";

const resumeRoutes = Router();

resumeRoutes.get(
  "/",
  authGard({ roles: [UserRole.CANDIDATE] }),
  resumeController.getResumes,
);

resumeRoutes.post(
  "/",
  authGard({ roles: [UserRole.CANDIDATE] }),
  upload.single("file"),
  resumeController.createResume,
);

resumeRoutes.patch(
  "/:id/primary",
  authGard({ roles: [UserRole.CANDIDATE] }),
  resumeController.setPrimaryResume,
);

resumeRoutes.delete(
  "/:id",
  authGard({ roles: [UserRole.CANDIDATE] }),
  resumeController.deleteResume,
);

export default resumeRoutes;
