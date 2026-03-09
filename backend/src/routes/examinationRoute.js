"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examinationService_1 = require("../services/examinationService");
const router = express_1.default.Router();
router.post("/add", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { patientId, complaint, complaintDuration, complaintSeverity, quickNotes, medicines, reportInfo, meetingType } = req.body;
    const { statusCode, data } = await (0, examinationService_1.addComplaint)({
        token,
        patientId,
        complaint,
        complaintDuration,
        complaintSeverity,
        quickNotes,
        medicines,
        reportInfo,
        meetingType
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/info/:patientId", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const patientId = req.params.patientId;
    const { statusCode, data } = await (0, examinationService_1.getExaminationInfo)({ token, patientId });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/user-info", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, examinationService_1.getExaminationUserInfo)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.delete("/delete/:examinationsId/:patientId/:doctorId", async (req, res) => {
    const examinationId = req.params.examinationsId;
    const patientId = req.params.patientId;
    const doctorId = req.params.doctorId;
    const { statusCode, data } = await (0, examinationService_1.getExaminationAndDelete)({
        examinationId,
        patientId,
        doctorId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
//-----------------------------------------------------------------------------
router.get("/dashboard/all-info", async (req, res) => {
    const { statusCode, data } = await (0, examinationService_1.getAllExaminations)();
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
exports.default = router;
//# sourceMappingURL=examinationRoute.js.map