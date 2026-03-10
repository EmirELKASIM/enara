"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
// utils/sendEmail.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resend_1 = require("resend");
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
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
exports.sendEmail = sendEmail;
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
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendVerificationEmail = async (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;
    const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;
    await resend.emails.send({
        from: `"Enara" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify Your Email",
        html: html,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=sendEmail.js.map