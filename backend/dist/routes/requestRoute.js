"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestService_1 = require("../services/requestService");
const router = express_1.default.Router();
router.post("/send", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { doctorId } = req.body;
    const { statusCode, data } = await (0, requestService_1.sendRequest)({
        token,
        doctorId,
    });
    return res.status(statusCode).json({
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
    const { statusCode, data } = await (0, requestService_1.getRequest)({
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/accepted", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, requestService_1.getAcceptRequest)({
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/linked/:doctorId", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const doctorId = req.params.doctorId;
    const { statusCode, data } = await (0, requestService_1.getLinkedRequest)({
        token,
        doctorId
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/info/:requestId", async (req, res) => {
    const requestId = req.params.requestId;
    if (!requestId) {
        return { data: "User not found!", statusCode: 400 };
    }
    const { statusCode, data } = await (0, requestService_1.getInfoWithId)({ requestId });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/notifications", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, requestService_1.getNotifications)({
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/read-notifications/:requestId/:notificationId", async (req, res) => {
    const requestId = req.params.requestId;
    const notificationId = req.params.notificationId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, requestService_1.readNotifications)({ requestId, notificationId, token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/update", async (req, res) => {
    const { acceptedFromDoctor, requestId } = req.body;
    const { statusCode, data } = await (0, requestService_1.updateRequest)({
        acceptedFromDoctor,
        requestId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.delete("/delete/:requestId/:patientId", async (req, res) => {
    const requestId = req.params.requestId;
    const patientId = req.params.patientId;
    if (!requestId) {
        return { data: "request not found ", statusCode: 400 };
    }
    const { statusCode, data } = await (0, requestService_1.deleteRequest)({ requestId, patientId });
    return res.status(statusCode).json({
        success: true,
        token: data
    });
});
//----------------------------------------------------------------------------
router.get("/dashboard/all-requests", async (req, res) => {
    const { statusCode, data } = await (0, requestService_1.getAllRequests)();
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
exports.default = router;
//# sourceMappingURL=requestRoute.js.map