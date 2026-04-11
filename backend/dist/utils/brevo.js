"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const client = SibApiV3Sdk.ApiClient.instance;
// API Key
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sendEmail = async (to, subject, html) => {
    try {
        const response = await emailApi.sendTransacEmail({
            sender: {
                email: process.env.EMAIL_USER,
                name: "Support",
            },
            to: [
                {
                    email: to,
                },
            ],
            subject,
            htmlContent: html,
        });
        console.log("Email sent:", response);
        return response;
    }
    catch (error) {
        console.error("Brevo error:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const sendVerificationEmail = async (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;
    const html = `
    <h2>Verify Your Email</h2>
    <p>Click the button below:</p>
    <a href="${link}" style="padding:10px;background:#4CAF50;color:white;">
      Verify Email
    </a>
  `;
    return (0, exports.sendEmail)(user.email, "Verify Email", html);
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=brevo.js.map