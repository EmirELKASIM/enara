// utils/sendEmail.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // يجب أن تكون false للمنفذ 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2", // إضافة إصدار التشفير قد يحل مشكلة الـ Timeout
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (user: any) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;

  await sendEmail(user.email, "Verify Your Email", html);
};
