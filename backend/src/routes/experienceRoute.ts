import express from "express";
import {
  addExperience,
  getExperience,
  getExperienceWithId,
  updateExperience,
} from "../services/experienceService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { userId, experienceSummary, experienceDesc, certificates, language } =
    req.body;
  const { statusCode, data } = await addExperience({
    userId,
    experienceSummary,
    experienceDesc,
    certificates,
    language,
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
  const { statusCode, data } = await getExperience({ token });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.get("/info/:id", async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: "userId not found" });
  }
  const { statusCode, data } = await getExperienceWithId({ userId });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

router.put("/update", async (req, res) => {
  const { userId, experienceSummary, experienceDesc, certificates, language } =
    req.body;
  const { statusCode, data } = await updateExperience({
    userId,
    experienceSummary,
    experienceDesc,
    certificates,
    language,
  });
  return res.status(statusCode).json({
    success: true,
    token: data,
  });
});

export default router;
