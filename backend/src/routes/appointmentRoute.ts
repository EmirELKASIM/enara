import express from "express";
import {
  addAppointment,
  deleteAppointment,
  deleteDate,
  getAllApointment,
  getApointments,
  getAppointments,
} from "../services/appointmentService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const { time, date, price, coinType ,duration} = req.body;
  const { statusCode, data } = await addAppointment({
    time,
    date,
    token,
    price,
    coinType,
    duration
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
  const { statusCode, data } = await getAppointments({ token });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.get("/all-info", async (req, res) => {
  const { statusCode, data } = await getAllApointment();
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
  const { statusCode, data } = await deleteAppointment({
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
  const { statusCode, data } = await deleteDate({ appointmentDate, token });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});
//---------------------------------------------------------------------------
router.get("/dashboard/all-appointments", async (req, res) => {
  const { statusCode, data } = await getApointments();
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

export default router;
