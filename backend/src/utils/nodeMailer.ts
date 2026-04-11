import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * إنشاء transporter
 */
const transporter = nodemailer.createTransport({
  service: "gmail", // يمكن تغييره لأي SMTP آخر
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // إذا Gmail، استخدم App Password
  },
});

/**
 * دالة عامة لإرسال أي بريد
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * دالة لإرسال بريد التحقق للمستخدم
 */
export const sendVerificationEmail = async (user:any) => {
  // إنشاء توكن JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;

  // إرسال البريد باستخدام sendEmail
  return sendEmail(user.email, "Verify Your Email", html);
};