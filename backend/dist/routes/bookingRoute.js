"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingService_1 = require("../services/bookingService");
const router = express_1.default.Router();
router.post("/add", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, appointmentDate, appointmentTime, appointmentDay, doctorFirstName, doctorLastName, doctorAccountType, meetingType, doctorId, reportInfo, appointmentPrice, appointmentCoinType, appointmentDuration } = req.body;
    const { statusCode, data } = await (0, bookingService_1.addBooking)({
        appointmentId,
        appointmentDate,
        appointmentTime,
        appointmentDay,
        doctorFirstName,
        doctorLastName,
        doctorAccountType,
        meetingType,
        doctorId,
        token,
        reportInfo,
        appointmentPrice,
        appointmentCoinType,
        appointmentDuration
    });
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
    const { statusCode, data } = await (0, bookingService_1.getBookedForUser)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/doctor-info", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, bookingService_1.getBookedForDoctor)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/user-history", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, bookingService_1.getHistoryForUser)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/report-info/:patientId", async (req, res) => {
    const patientId = req.params.patientId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, bookingService_1.getReportInfo)({ token, patientId });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/doctor-history", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, bookingService_1.getHistoryForDoctor)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.get("/dekont-details/:appointmentId/:patientId", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const appointmentId = req.params.appointmentId;
    const patientId = req.params.patientId;
    const { statusCode, data } = await (0, bookingService_1.getDekontDetails)({
        token,
        appointmentId,
        patientId,
    });
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
    const { statusCode, data } = await (0, bookingService_1.getNotifications)({
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/read-notifications/:bookingId/:notificationId", async (req, res) => {
    const bookingId = req.params.bookingId;
    const notificationId = req.params.notificationId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, bookingService_1.readNotifications)({ bookingId, notificationId, token });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/cancel", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, appointmentDate, appointmentTime, doctorId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.onCanceled)({
        token,
        appointmentId,
        appointmentDate,
        appointmentTime,
        doctorId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/user-history-delete", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.onUserHistoryDelete)({
        token,
        appointmentId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/doctor-history-delete", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.onDoctorHistoryDelete)({
        token,
        appointmentId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/meeting-active", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, meetingUrl } = req.body;
    const { statusCode, data } = await (0, bookingService_1.onIsActive)({
        token,
        appointmentId,
        meetingUrl,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.post("/meeting-active-info", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.getActiveAppointment)({
        token,
        appointmentId,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/update", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { newAppointmentId, bookingId, newTime, newDay, newDate, newDuration } = req.body;
    const { statusCode, data } = await (0, bookingService_1.updateBooking)({
        newAppointmentId,
        bookingId,
        newTime,
        newDay,
        newDate,
        newDuration,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/change", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { changeDetails, appointmentId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.changeBooking)({
        changeDetails,
        appointmentId,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/dekont", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, dekontCode, dekontNotes } = req.body;
    const { statusCode, data } = await (0, bookingService_1.sendDekont)({
        dekontCode,
        dekontNotes,
        appointmentId,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/accept-dekont", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, patientId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.acceptedDekont)({
        appointmentId,
        patientId,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/paid-card", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { appointmentId, doctorId } = req.body;
    const { statusCode, data } = await (0, bookingService_1.paidByCard)({
        appointmentId,
        doctorId,
        token,
    });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
//---------------------------------------------------------------------------
router.get("/dashboard/all-bookings", async (req, res) => {
    const { statusCode, data } = await (0, bookingService_1.getAllBookings)();
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
exports.default = router;
//# sourceMappingURL=bookingRoute.js.map