import { envConfig } from "../config/env";
import jwt from "jsonwebtoken";
type JwtPayload = {
  id: string;
  email: string;
  role: "USER" | "EMPLOYER" | "ADMIN";
};
export const generateTokens = (user: JwtPayload) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, envConfig.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
