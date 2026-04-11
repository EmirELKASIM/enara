import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY as string;
const BASE_URL = "https://api.brevo.com/v3";

/**
 * إرسال إيميل عام عبر HTTP API
 */
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/smtp/email`,
      {
        sender: {
          name: "Support Team",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
      }
    );

    console.log("Email sent:", response.data.messageId);
    return response.data;
  } catch (error: any) {
    console.error(
      "Brevo Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * إرسال إيميل التحقق
 */
export const sendVerificationEmail = async (user: any) => {
  if (!user.email || !user._id) {
    throw new Error("User email or ID is missing.");
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

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

  return sendEmail(user.email, "Verify Your Email", html);
};