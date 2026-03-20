import { Router } from "express";
import userRouter from "../modules/user/user.route";
import candidateRouter from "../modules/candidate/candidate.route";

const routes = Router();
routes.use("/auth", userRouter);
routes.use("/candidate", candidateRouter);
export default routes;
