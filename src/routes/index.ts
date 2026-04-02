import { Router } from "express";
import userRouter from "../modules/user/user.route";
import candidateRouter from "../modules/candidate/candidate.route";
import recruiterRouter from "../modules/recruiter/recruiter.route";

const routes = Router();
routes.use("/auth", userRouter);
routes.use("/candidate", candidateRouter);
routes.use("/recruiter", recruiterRouter);
export default routes;
