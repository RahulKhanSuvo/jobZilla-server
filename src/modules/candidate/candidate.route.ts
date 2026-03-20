import { Router } from "express";
import { candidateController } from "./candidate.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { upload } from "../../middleware/upload";
import { validate } from "../../middleware/validate.middleware";
import { candidateSchema } from "../user/candidate.schema";

const candidateRouter = Router();

candidateRouter.get("/", candidateController.getCandidate);
candidateRouter.patch(
  "/",
  authGard(UserRole.CANDIDATE),
  upload.single("avatar"),
  validate(candidateSchema),
  candidateController.updateCandidate,
);

export default candidateRouter;
