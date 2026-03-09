import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.ENCRYPT_SECRET || "fallback_secret";

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

export const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};