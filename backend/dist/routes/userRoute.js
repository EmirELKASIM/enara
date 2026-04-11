"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const router = express_1.default.Router();
router.post("/register", async (request, response) => {
    const { firstName, lastName, email, password, accountType, birthday, gender, maritalStatus, consultation, privacyPolicy, phoneNumber, captcha } = request.body;
    // const isHuman = await verifyCaptcha(captcha);
    // if (!isHuman) {
    //   return response.status(400).json({
    //     message: "Captcha verification failed"
    //   });
    // }
    const { statusCode, data } = await (0, userService_1.register)({
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
    const { statusCode, data } = await (0, userService_1.login)({ email, password });
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
    const result = await (0, userService_1.getInfo)({ token });
    return res.status(result.statusCode).json(result.data);
});
router.get("/info/:id", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(401).json({ message: "userId not found" });
    }
    const { statusCode, data } = await (0, userService_1.getInfoWithId)({ userId });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/update", async (req, res) => {
    const { id, firstName, lastName, gender, birthday, maritalStatus, phoneNumber, } = req.body;
    const { statusCode, data } = await (0, userService_1.updateInfo)({
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
    const { statusCode, message } = await (0, userService_1.forgotPassword)({ email });
    return res.status(statusCode).json({
        success: true,
        token: message,
    });
});
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    const { statusCode, message } = await (0, userService_1.resetPasword)({ token, newPassword });
    return res.status(statusCode).json({
        success: true,
        token: message,
    });
});
router.post("/change-password", async (req, res) => {
    const { token, oldPassword, newPassword } = req.body;
    const { statusCode, data } = await (0, userService_1.changePasword)({
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
    const { statusCode, data } = await (0, userService_1.deleteAccount)({ token });
    return res.status(statusCode).json({ success: true, token: data });
});
router.get("/verify-email/:token", async (req, res) => {
    const token = req.params.token;
    const { statusCode, data } = await (0, userService_1.verifyEmail)({ token });
    return res.status(statusCode).json({ success: true, token: data });
});
//-------------------------------------------------------------------------
router.get("/dashboard/personal-users", async (req, res) => {
    const { statusCode, data } = await (0, userService_1.getPersonalUsers)();
    return res.status(statusCode).json({ success: true, token: data });
});
router.get("/dashboard/impersonal-users", async (req, res) => {
    const { statusCode, data } = await (0, userService_1.getImpersonalUsers)();
    return res.status(statusCode).json({ success: true, token: data });
});
router.get("/dashboard/unpermissible-doctors", async (req, res) => {
    const { statusCode, data } = await (0, userService_1.getUnpermissibleDoctors)();
    return res.status(statusCode).json({ success: true, token: data });
});
router.put("/dashboard/unpermissible-doctors/approving", async (req, res) => {
    const { doctorId } = req.body;
    const { statusCode, data } = await (0, userService_1.onApproving)({ doctorId });
    return res.status(statusCode).json({ success: true, token: data });
});
exports.default = router;
//# sourceMappingURL=userRoute.js.map