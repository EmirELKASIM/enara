"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const summaryService_1 = require("../services/summaryService");
const router = express_1.default.Router();
router.post("/add", async (req, res) => {
    const { psychologicalSummary, userId } = req.body;
    const { statusCode, data } = await (0, summaryService_1.sendSummary)({ userId, psychologicalSummary });
    return res.status(statusCode).json({
        success: true,
        token: data
    });
});
router.get("/info", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { statusCode, data } = await (0, summaryService_1.getSummary)({ token });
    return res.status(statusCode).json({
        success: true,
        token: data
    });
});
router.get("/info/:id", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(401).json({ message: "userId not found" });
    }
    const { statusCode, data } = await (0, summaryService_1.getSummaryWithId)({ userId });
    return res.status(statusCode).json({
        success: true,
        token: data
    });
});
router.put("/update", async (req, res) => {
    const { psychologicalSummary, userId } = req.body;
    const { statusCode, data } = await (0, summaryService_1.updateSummary)({ userId, psychologicalSummary });
    return res.status(statusCode).json({
        success: true,
        token: data
    });
});
exports.default = router;
//# sourceMappingURL=summaryRoute.js.map