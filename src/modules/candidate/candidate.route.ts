import { Router } from "express";
import { candidateController } from "./candidate.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { upload } from "../../middleware/upload";
import { validate } from "../../middleware/validate.middleware";
import { candidateSchema } from "./candidate.schema";
import { parseFormData } from "../../middleware/FromParse";
import resumeRoutes from "./resume/resume.route";

const candidateRouter = Router();

candidateRouter.get("/", candidateController.getCandidate);
candidateRouter.patch(
  "/update",
  authGard({ roles: [UserRole.CANDIDATE] }),
  upload.single("avatar"),
  parseFormData,
  validate(candidateSchema),
  candidateController.updateCandidate,
);

candidateRouter.use("/resume", resumeRoutes);

export default candidateRouter;
