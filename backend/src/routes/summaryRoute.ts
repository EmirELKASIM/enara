import express from "express";
import { getSummary, getSummaryWithId, sendSummary, updateSummary } from "../services/summaryService";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { psychologicalSummary, userId } = req.body;
  const { statusCode, data } = await sendSummary({ userId, psychologicalSummary });
  return res.status(statusCode).json({
    success:true,
    token:data
  })
});


router.get("/info", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const { statusCode, data } = await getSummary({ token });
  return res.status(statusCode).json({
    success:true,
    token:data
  })
});

router.get("/info/:id", async (req, res) => {
 const userId = req.params.id;
  if(!userId){
        return res.status(401).json({ message: "userId not found" });
    }
  const { statusCode, data } = await getSummaryWithId({ userId });
  return res.status(statusCode).json({
    success:true,
    token:data
  })
});

router.put("/update", async (req, res) => {
  const { psychologicalSummary, userId } = req.body;
  const { statusCode, data } = await updateSummary({ userId, psychologicalSummary });
  return res.status(statusCode).json({
    success:true,
    token:data
  })
});

export default router;

