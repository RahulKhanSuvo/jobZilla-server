import { Router } from "express";
import { jobsController } from "./jobs.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";

const jobsRoutes = Router();

jobsRoutes.get("/", (req, res) => {
  res.send("Jobs routes");
});

jobsRoutes.post("/", authGard(UserRole.EMPLOYER), jobsController.createJob);

export default jobsRoutes;
