"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experienceService_1 = require("../services/experienceService");
const router = express_1.default.Router();
router.post("/add", async (req, res) => {
    const { userId, experienceSummary, experienceDesc, certificates, language } = req.body;
    const { statusCode, data } = await (0, experienceService_1.addExperience)({
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
    const { statusCode, data } = await (0, experienceService_1.getExperience)({ token });
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
    const { statusCode, data } = await (0, experienceService_1.getExperienceWithId)({ userId });
    return res.status(statusCode).json({
        success: true,
        token: data,
    });
});
router.put("/update", async (req, res) => {
    const { userId, experienceSummary, experienceDesc, certificates, language } = req.body;
    const { statusCode, data } = await (0, experienceService_1.updateExperience)({
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
exports.default = router;
//# sourceMappingURL=experienceRoute.js.map