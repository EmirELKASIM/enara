import express from "express";
import { addDiagnosis, getDiagnosis, updateDiagnosis } from "../services/diagnosisService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const {
    patientId,
    clinicalHistory,
    sawDoctorBefore,
    sleepedAtHospital,
    drankMedicinesBefore,
    diseaseName,
    accompanyingDiagnoses,
    diagnosesNotes,
    severityOfDisorder,
    durationOfDisorder,
    riskLevel,
  } = req.body;
  const { statusCode, data } = await addDiagnosis({
    token,
    patientId,
    clinicalHistory,
    sawDoctorBefore,
    sleepedAtHospital,
    drankMedicinesBefore,
    diseaseName,
    accompanyingDiagnoses,
    diagnosesNotes,
    severityOfDisorder,
    durationOfDisorder,
    riskLevel,
  });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.get("/info/:id", async (req, res) => {
  const patientId = req.params.id;
  if (!patientId) {
    return res.status(401).json({ message: "ID not found" });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const { statusCode, data } = await getDiagnosis({ patientId, token });
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
  const {
    patientId,
    clinicalHistory,
    sawDoctorBefore,
    sleepedAtHospital,
    drankMedicinesBefore,
    diseaseName,
    accompanyingDiagnoses,
    diagnosesNotes,
    severityOfDisorder,
    durationOfDisorder,
    riskLevel,
    diagnosisId
  } = req.body;
  const { statusCode, data } = await updateDiagnosis({
    token,
    patientId,
    clinicalHistory,
    sawDoctorBefore,
    sleepedAtHospital,
    drankMedicinesBefore,
    diseaseName,
    accompanyingDiagnoses,
    diagnosesNotes,
    severityOfDisorder,
    durationOfDisorder,
    riskLevel,
    diagnosisId
  });
  return res.status(statusCode).json({
    success: true,
    token: data
  })
});

export default router;
