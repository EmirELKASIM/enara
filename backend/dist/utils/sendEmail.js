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
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
exports.sendEmail = sendEmail;
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