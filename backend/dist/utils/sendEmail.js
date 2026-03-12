"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    try {
        const response = await resend.emails.send({
            from: `Support <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });
        console.log("Email sent:", response);
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
    await resend.emails.send({
        from: `Enara <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify Your Email",
        html: html,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=sendEmail.js.map