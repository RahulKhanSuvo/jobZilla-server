import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
