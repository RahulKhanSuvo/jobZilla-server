import express from "express";
import cors from "cors";
import routes from "./routes";
import { notFound } from "./middleware/notFoundLogger";
import { errorHandler } from "./middleware/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
