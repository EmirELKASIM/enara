import express from "express";
import {
  acceptedDekont,
  addBooking,
  changeBooking,
  getActiveAppointment,
  getAllBookings,
  getBookedForDoctor,
  getBookedForUser,
  getDekontDetails,
  getHistoryForDoctor,
  getHistoryForUser,
  getReportInfo,
  onCanceled,
  onDoctorHistoryDelete,
  onIsActive,
  onUserHistoryDelete,
  sendDekont,
  updateBooking,
} from "../services/bookingService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const {
    appointmentId,
    appointmentDate,
    appointmentTime,
    appointmentDay,
    doctorFirstName,
    doctorLastName,
    doctorAccountType,
    meetingType,
    doctorId,
    reportInfo,
    appointmentPrice,
    appointmentCoinType,
  } = req.body;
  const { statusCode, data } = await addBooking({
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
  const { statusCode, data } = await getBookedForUser({ token });
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
  const { statusCode, data } = await getBookedForDoctor({ token });
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
  const { statusCode, data } = await getHistoryForUser({ token });
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
  const { statusCode, data } = await getReportInfo({ token, patientId });
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
  const { statusCode, data } = await getHistoryForDoctor({ token });
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

  const { statusCode, data } = await getDekontDetails({
    token,
    appointmentId,
    patientId,
  });
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
  const { appointmentId, appointmentDate, appointmentTime, doctorId } =
    req.body;
  const { statusCode, data } = await onCanceled({
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
  const { statusCode, data } = await onUserHistoryDelete({
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
  const { statusCode, data } = await onDoctorHistoryDelete({
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
  const { statusCode, data } = await onIsActive({
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
  const { statusCode, data } = await getActiveAppointment({
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
  const { newAppointmentId, bookingId, newTime, newDay, newDate } = req.body;
  const { statusCode, data } = await updateBooking({
    newAppointmentId,
    bookingId,
    newTime,
    newDay,
    newDate,
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
  const { statusCode, data } = await changeBooking({
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
  const { statusCode, data } = await sendDekont({
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
  const { statusCode, data } = await acceptedDekont({
    appointmentId,
    patientId,
    token,
  });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

//---------------------------------------------------------------------------

router.get("/dashboard/all-bookings", async (req, res) => {
  const { statusCode, data } = await getAllBookings();
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

export default router;
