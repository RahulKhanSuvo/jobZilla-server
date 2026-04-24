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
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESET_LINK_BASE_URL: z.string().optional(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}
export const envConfig = parsedEnv.data;
