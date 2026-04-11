const SibApiV3Sdk = require("sib-api-v3-sdk");
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;

// API Key
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();


export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_USER!, 
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
  } catch (error) {
    console.error("Brevo error:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (user: any) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Verify Your Email</h2>
    <p>Click the button below:</p>
    <a href="${link}" style="padding:10px;background:#4CAF50;color:white;">
      Verify Email
    </a>
  `;

  return sendEmail(user.email, "Verify Email", html);
};