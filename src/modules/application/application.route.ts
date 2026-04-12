import { Router } from "express";
import { ApplicationController } from "./application.controller";

const router = Router();

router.post("/", ApplicationController.createApplication);

export const ApplicationRoutes = router;
