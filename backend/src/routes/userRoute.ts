import express, { request } from "express";
import {
  changePasword,
  deleteAccount,
  forgotPassword,
  getImpersonalUsers,
  getInfo,
  getInfoWithId,
  getPersonalUsers,
  getUnpermissibleDoctors,
  login,
  onApproving,
  register,
  resetPasword,
  updateInfo,
  verifyEmail,
} from "../services/userService";
import { verifyCaptcha } from "../utils/verifyCaptcha";

const router = express.Router();

router.post("/register", async (request, response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    accountType,
    birthday,
    gender,
    maritalStatus,
    consultation,
    privacyPolicy,
    phoneNumber,
    captcha
  } = request.body;
  // const isHuman = await verifyCaptcha(captcha);

  // if (!isHuman) {
  //   return response.status(400).json({
  //     message: "Captcha verification failed"
  //   });
  // }
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
    accountType,
    birthday,
    gender,
    maritalStatus,
    consultation,
    privacyPolicy,
    phoneNumber,
  });
  response.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const { statusCode, data } = await login({ email, password });
  response.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.get("/info", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const result = await getInfo({ token });

  return res.status(result.statusCode).json(result.data);
});

router.get("/info/:id", async (req, res) => {
  const userId = req.params.id;
  if(!userId){
        return res.status(401).json({ message: "userId not found" });
    }
  const { statusCode, data } = await getInfoWithId({ userId });

  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.put("/update", async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    gender,
    birthday,
    maritalStatus,
    phoneNumber,
  } = req.body;
  const { statusCode, data } = await updateInfo({
    id,
    firstName,
    lastName,
    gender,
    birthday,
    maritalStatus,
    phoneNumber,
  });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const { statusCode, message } = await forgotPassword({ email });
  return res.status(statusCode).json({
    success: true,
    token: message,
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const { statusCode, message } = await resetPasword({ token, newPassword });
  return res.status(statusCode).json({
    success: true,
    token: message,
  });
});

router.post("/change-password", async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;
  const { statusCode, data } = await changePasword({
    token,
    oldPassword,
    newPassword,
  });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.delete("/delete", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  const { statusCode, data } = await deleteAccount({ token });
  return res.status(statusCode).json({ success: true, token: data });
});



router.get("/verify-email/:token", async( req , res)=>{
  const token  = req.params.token;
  const { statusCode, data } = await verifyEmail({ token });
  return res.status(statusCode).json({ success: true, token: data });
});
//-------------------------------------------------------------------------

router.get("/dashboard/personal-users", async (req, res) => {
  const { statusCode, data } = await getPersonalUsers();
  return res.status(statusCode).json({ success: true, token: data });
});
router.get("/dashboard/impersonal-users", async (req, res) => {
  const { statusCode, data } = await getImpersonalUsers();
  return res.status(statusCode).json({ success: true, token: data });
});

router.get("/dashboard/unpermissible-doctors", async (req, res) => {
  const { statusCode, data } = await getUnpermissibleDoctors();
  return res.status(statusCode).json({ success: true, token: data });
});
router.put("/dashboard/unpermissible-doctors/approving", async (req, res) => {
  const {doctorId} = req.body;
  const { statusCode, data } = await onApproving({doctorId});
  return res.status(statusCode).json({ success: true, token: data });
});

export default router;
