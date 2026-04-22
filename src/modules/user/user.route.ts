import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from "./user.schema";

import { authGard } from "../../middleware/authGard";

const userRouter = Router();
userRouter.post(
  "/register",
  validate(createUserSchema),
  userController.createUser,
);
userRouter.post("/login", validate(loginSchema), userController.loginUser);
userRouter.post("/refresh", userController.userTokenRefresh);
userRouter.get("/me", authGard(), userController.currentUser);
userRouter.post("/logout", userController.userLogout);
userRouter.put(
  "/change-password",
  authGard(),
  validate(changePasswordSchema),
  userController.changePassword,
);

export default userRouter;
