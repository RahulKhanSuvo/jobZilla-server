import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema } from "./user.schema";

const userRouter = Router()
userRouter.post("/register", validate(createUserSchema), userController.createUser)

export default userRouter