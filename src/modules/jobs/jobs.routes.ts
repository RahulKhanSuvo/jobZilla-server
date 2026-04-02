import { Router } from "express";
import { jobsController } from "./jobs.controller";

const jobsRoutes = Router();

jobsRoutes.get("/", (req, res) => {
  res.send("Jobs routes");
});

jobsRoutes.post("/", jobsController.createJob);

export default jobsRoutes;
