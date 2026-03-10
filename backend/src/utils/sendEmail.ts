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
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   console.log("--- Email Debug Start ---");
//   console.log("Target Email:", to);
//   console.log("Env User:", process.env.EMAIL_USER);
//   console.log("Env Pass Length:", process.env.EMAIL_PASS?.length || 0);

//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     console.error("❌ خطأ: المتغيرات غير موجودة في بيئة العمل!");
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//       minVersion: "TLSv1.2",
//     },
//   });
//   try {
//     const info = await transporter.sendMail({
//       from: `"Support" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log("email", info);
//   } catch (error: any) {
//     console.error("Error sending email:", error);
//   }
// };

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
