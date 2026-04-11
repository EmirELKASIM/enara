import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true, 
  connectionTimeout: 20000, 
  greetingTimeout: 10000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized: false,
  },
});



// export const sendEmail = async (to: string, subject: string, html: string) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Support" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent:", info.response);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailData = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    console.log("Email sent:", info);
    return info;

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


export const sendVerificationEmail = async (user:any) => {
 
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const link = `${process.env.FRONTEND_URL}/user/verify-email/${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>
  `;

  return sendEmail(user.email, "Verify Your Email", html);
};