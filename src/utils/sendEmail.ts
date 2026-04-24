import nodemailer from "nodemailer";
import { envConfig } from "../config/env";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.SMTP_HOST || "smtp.gmail.com",
    port: Number(envConfig.SMTP_PORT) || 587,
    secure: Number(envConfig.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: envConfig.SMTP_USER,
      pass: envConfig.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"JobZilla" <${envConfig.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
