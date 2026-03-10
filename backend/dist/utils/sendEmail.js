"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
// utils/sendEmail.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true,
        logger: true,
    });
    const info = await transporter.sendMail({
        from: '"Support" <support@test.com>',
        to,
        subject,
        html,
    });
    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer_1.default.getTestMessageUrl(info));
};
exports.sendEmail = sendEmail;
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
const sendVerificationEmail = async (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;
    const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;
    await (0, exports.sendEmail)(user.email, "Verify Your Email", html);
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=sendEmail.js.map