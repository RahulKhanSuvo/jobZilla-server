import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema, loginSchema } from "./user.schema";

const userRouter = Router();
userRouter.post(
  "/register",
  validate(createUserSchema),
  userController.createUser,
);
userRouter.post("/login", validate(loginSchema), userController.loginUser);
userRouter.post("/refresh", userController.userTokenRefresh);
userRouter.get("/me", userController.currentUser);
userRouter.post("/logout", userController.userLogout);

export default userRouter;
