import { Router } from "express";
import userRouter from "../modules/user/user.route";

const routes = Router();
routes.use("/auth", userRouter);
export default routes;
