import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import summaryRoute from "./routes/summaryRoute";
import experienceRoute from "./routes/experienceRoute";
import appointmentRoute from "./routes/appointmentRoute";
import bookingRoute from "./routes/bookingRoute";
import diagnosisRoute from "./routes/diagnosisRoute";
import requestRoute from "./routes/requestRoute";
import examinationRoute from "./routes/examinationRoute";
import "./utils/bookingAutoCancel";
import "./utils/bookingCompleteJob";
import "./utils/appointmentCleanup";
import path from "path";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT)|| 3001;
const cors = require("cors");

app.use(
  cors({
    origin:"https://enaramind.com", // Angular
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","ngrok-skip-browser-warning"],
  }),
);

app.use(express.json());
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Mongo Connected!"))
  .catch((err) => console.log("failed to connect!", err));

app.use("/user", userRoute);
app.use("/summary", summaryRoute);
app.use("/experience", experienceRoute);
app.use("/appointment", appointmentRoute);
app.use("/booking", bookingRoute);
app.use("/diagnosis", diagnosisRoute);
app.use("/request", requestRoute);
app.use("/examination", examinationRoute);
app.use(express.static(path.join(__dirname, "../frontend/enara/dist/enara")));
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/enara/dist/enara/index.html"));
});
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at: http://localhost/:${port}`);
});
