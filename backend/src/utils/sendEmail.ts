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


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (user: any) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;

  await resend.emails.send({
    from: "support@enaraapp.com",
    to: user.email,
    subject: "Verify Your Email",
    html: html,
  });
  console.log(process.env.RESEND_API_KEY)
  console.log(process.env.FRONTEND_URL)
  console.log(link)

};