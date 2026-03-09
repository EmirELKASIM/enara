"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentService_1 = require("../services/appointmentService");
const router = express_1.default.Router();
router.post("/add", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { time, date, price, coinType } = req.body;
    const { statusCode, data } = await (0, appointmentService_1.addAppointment)({
        time,
        date,
        token,
        price,
        coinType,
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
    const { statusCode, data } = await (0, appointmentService_1.getAppointments)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/all-info", async (req, res) => {
    const { statusCode, data } = await (0, appointmentService_1.getAllApointment)();
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.delete("/delete-appointment", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentTime, appointmentDate } = req.body;
    const { statusCode, data } = await (0, appointmentService_1.deleteAppointment)({
        appointmentTime,
        appointmentDate,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.delete("/delete-date", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentDate } = req.body;
    const { statusCode, data } = await (0, appointmentService_1.deleteDate)({ appointmentDate, token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
//---------------------------------------------------------------------------
router.get("/dashboard/all-appointments", async (req, res) => {
    const { statusCode, data } = await (0, appointmentService_1.getApointments)();
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
exports.default = router;
//# sourceMappingURL=appointmentRoute.js.map