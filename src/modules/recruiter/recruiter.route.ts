import { Router } from "express";
import { recruiterController } from "./recruiter.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { validate } from "../../middleware/validate.middleware";
import { recruiterSchema } from "./recruiter.schema";
import { upload } from "../../middleware/upload";

const recruiterRouter = Router();

recruiterRouter.get("/", (req, res) => {
  res.send("Hello World!");
});
recruiterRouter.patch(
  "/update",
  authGard(UserRole.EMPLOYER),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate(recruiterSchema),
  recruiterController.updateRecruiter,
);

export default recruiterRouter;
