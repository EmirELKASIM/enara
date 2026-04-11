"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BASE_URL = "https://api.brevo.com/v3";
/**
 * إرسال إيميل عام عبر HTTP API
 */
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const response = await axios_1.default.post(`${BASE_URL}/smtp/email`, {
            sender: {
                name: "Support Team",
                email: process.env.EMAIL_USER,
            },
            to: [{ email: to }],
            subject,
            htmlContent,
        }, {
            headers: {
                "api-key": BREVO_API_KEY,
                "content-type": "application/json",
                accept: "application/json",
            },
        });
        console.log("Email sent:", response.data.messageId);
        return response.data;
    }
    catch (error) {
        console.error("Brevo Error:", error.response?.data || error.message);
        throw error;
    }
};
exports.sendEmail = sendEmail;
/**
 * إرسال إيميل التحقق
 */
const sendVerificationEmail = async (user) => {
    if (!user.email || !user._id) {
        throw new Error("User email or ID is missing.");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;
    const html = `
    <div style="font-family: Arial; text-align:center; padding:20px;">
      <h2>Verify Your Email</h2>
      <p>Click the button below:</p>

      <a href="${link}" style="padding:12px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Verify Email
      </a>

      <p style="margin-top:20px; font-size:12px;">
        ${link}
      </p>
    </div>
  `;
    return (0, exports.sendEmail)(user.email, "Verify Your Email", html);
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=brevo.js.map