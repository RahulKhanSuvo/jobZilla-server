import dotenv from "dotenv";
import z from "zod";
dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string(),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  IMGBB_API_KEY: z.string().optional(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}
export const envConfig = parsedEnv.data;
