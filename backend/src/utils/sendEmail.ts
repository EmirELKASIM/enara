// utils/sendEmail.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ضروري جداً لسيرفرات Render
    },
  });

  await transporter
    .sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    .then(() => console.log("Email sent successfully"))
    .catch((err) => console.error("Error sending email:", err));
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
