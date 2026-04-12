import { Router } from "express";
import userRouter from "../modules/user/user.route";
import candidateRouter from "../modules/candidate/candidate.route";
import recruiterRouter from "../modules/recruiter/recruiter.route";
import jobsRoutes from "../modules/jobs/jobs.routes";
import { ApplicationRoutes } from "../modules/application/application.route";

const routes = Router();
routes.use("/auth", userRouter);
routes.use("/candidate", candidateRouter);
routes.use("/recruiter", recruiterRouter);
routes.use("/jobs", jobsRoutes);
routes.use("/application", ApplicationRoutes);
export default routes;
