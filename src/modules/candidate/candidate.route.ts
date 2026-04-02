import { Router } from "express";
import { candidateController } from "./candidate.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { upload } from "../../middleware/upload";
import { validate } from "../../middleware/validate.middleware";
import { candidateSchema } from "./candidate.schema";

const candidateRouter = Router();

candidateRouter.get("/", candidateController.getCandidate);
candidateRouter.patch(
  "/",
  authGard(UserRole.CANDIDATE),
  upload.single("avatar"),
  (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (e) {
        console.log(e);
        res
          .status(400)
          .json({ success: false, message: "Invalid JSON in data field" });
        return;
      }
    }
    next();
  },
  validate(candidateSchema),
  candidateController.updateCandidate,
);

export default candidateRouter;
