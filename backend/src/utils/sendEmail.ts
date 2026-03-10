// utils/sendEmail.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import { Resend } from "resend";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();
  console.log("SMTP Connected");

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// export const sendVerificationEmail = async (user: any) => {
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//     expiresIn: "1d",
//   });

//   const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

//   const html = `
//     <h2>Email Verification</h2>
//     <p>Please click the link below to verify your email:</p>
//     <a href="${link}">Verify Email</a>
//   `;

//   await sendEmail(user.email, "Verify Your Email", html);
// };


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (user: any) => {
  // إنشاء توكن JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">Verify Email</a>
  `;

  const msg = {
    to: user.email, // البريد الذي ستصله الرسالة
    from: process.env.EMAIL_USER!, // البريد المرسل
    subject: "Verify Your Email",
    html: html,
  };

  await sgMail.send(msg);
  console.log("Email sent successfully to", user.email);
};