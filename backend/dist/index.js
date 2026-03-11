"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const summaryRoute_1 = __importDefault(require("./routes/summaryRoute"));
const experienceRoute_1 = __importDefault(require("./routes/experienceRoute"));
const appointmentRoute_1 = __importDefault(require("./routes/appointmentRoute"));
const bookingRoute_1 = __importDefault(require("./routes/bookingRoute"));
const diagnosisRoute_1 = __importDefault(require("./routes/diagnosisRoute"));
const requestRoute_1 = __importDefault(require("./routes/requestRoute"));
const examinationRoute_1 = __importDefault(require("./routes/examinationRoute"));
require("./utils/bookingAutoCancel");
require("./utils/bookingCompleteJob");
require("./utils/appointmentCleanup");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
const cors = require("cors");
app.use(cors({
    origin: "https://enaramind.com", // Angular
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
}));
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.DATABASE_URL || "")
    .then(() => console.log("Mongo Connected!"))
    .catch((err) => console.log("failed to connect!", err));
app.use("/user", userRoute_1.default);
app.use("/summary", summaryRoute_1.default);
app.use("/experience", experienceRoute_1.default);
app.use("/appointment", appointmentRoute_1.default);
app.use("/booking", bookingRoute_1.default);
app.use("/diagnosis", diagnosisRoute_1.default);
app.use("/request", requestRoute_1.default);
app.use("/examination", examinationRoute_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/enara/dist/enara")));
app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/enara/dist/enara/index.html"));
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at: http://localhost/:${port}`);
});
//# sourceMappingURL=index.js.map