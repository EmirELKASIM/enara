// utils/sendEmail.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log("--- Email Debug Start ---");
  console.log("Target Email:", to);
  console.log("Env User:", process.env.EMAIL_USER); // هل سيظهر الاسم أم undefined؟
  console.log("Env Pass Length:", process.env.EMAIL_PASS?.length || 0); // هل الرمز موجود؟

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ خطأ: المتغيرات غير موجودة في بيئة العمل!");
    return; // توقف هنا لكي لا يعلق السيرفر في Timeout
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // استخدم 465 مع secure:true
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ضروري جداً لسيرفرات Render
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("email", info);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
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
