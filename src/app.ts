import express from "express";
import cors from "cors";
import routes from "./routes";
import { notFound } from "./middleware/notFoundLogger";
import { errorHandler } from "./middleware/globalErrorHandler";
import { envConfig } from "./config/env";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: envConfig.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);
export default app;
