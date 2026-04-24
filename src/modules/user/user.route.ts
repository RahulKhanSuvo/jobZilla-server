import { Router } from "express";
import { userController } from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  changePasswordSchema,
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "./user.schema";

import { authGard } from "../../middleware/authGard";

const userRouter = Router();
userRouter.post(
  "/register",
  validate(createUserSchema),
  userController.createUser,
);
userRouter.post("/login", validate(loginSchema), userController.loginUser);
userRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  userController.forgotPassword,
);
userRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  userController.resetPassword,
);
userRouter.post("/refresh", userController.userTokenRefresh);
userRouter.get("/me", authGard(), userController.currentUser);
userRouter.post("/logout", userController.userLogout);
userRouter.put(
  "/change-password",
  authGard({ roles: ["CANDIDATE", "EMPLOYER", "ADMIN"] }),
  validate(changePasswordSchema),
  userController.changePassword,
);
userRouter.delete("/delete-account", authGard(), userController.deleteAccount);

export default userRouter;
