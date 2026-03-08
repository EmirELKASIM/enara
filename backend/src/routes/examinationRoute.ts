import express from "express";
import {
  addComplaint,
  getAllExaminations,
  getExaminationAndDelete,
  getExaminationInfo,
  getExaminationUserInfo,
} from "../services/examinationService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const {
    patientId,
    complaint,
    complaintDuration,
    complaintSeverity,
    quickNotes,
    medicines,
    reportInfo,
    meetingType
  } = req.body;
  const { statusCode, data } = await addComplaint({
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
  const { statusCode, data } = await getExaminationInfo({ token, patientId });
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
  const { statusCode, data } = await getExaminationUserInfo({ token });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});


router.delete(
  "/delete/:examinationsId/:patientId/:doctorId",
  async (req, res) => {
    const examinationId = req.params.examinationsId;
    const patientId = req.params.patientId;
    const doctorId = req.params.doctorId;

    const { statusCode, data } = await getExaminationAndDelete({
      examinationId,
      patientId,
      doctorId,
    });
    return res.status(statusCode).json({
      success: true,
      token: data,
    });
  },
);

//-----------------------------------------------------------------------------

router.get("/dashboard/all-info",async(req , res)=>{
  const { statusCode, data } = await getAllExaminations();
    return res.status(statusCode).json({
      success: true,
      token: data,
    });
})

export default router;
