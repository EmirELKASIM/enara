"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSummary = exports.getSummaryWithId = exports.getSummary = exports.sendSummary = void 0;
const helperJWT_1 = require("../../middlewares/helperJWT");
const encryption_1 = require("../../utils/encryption");
const summaryModel_1 = __importDefault(require("../models/summaryModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendSummary = async ({ userId, psychologicalSummary, }) => {
    const findUser = await userModel_1.default.findById(userId);
    if (!findUser) {
        return { data: "User not found", statusCode: 401 };
    }
    const newSummary = new summaryModel_1.default({
        userId,
        psychologicalSummary: (0, encryption_1.encrypt)(psychologicalSummary),
    });
    await newSummary.save();
    return {
        data: newSummary,
        statusCode: 200,
    };
};
exports.sendSummary = sendSummary;
const getSummary = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return {
            data: "Invalid token",
            statusCode: 400,
        };
    }
    const findSummary = await summaryModel_1.default.findOne({ userId: tokenDetails.id });
    if (!findSummary) {
        return { data: "Write a summary of the patient's condition", statusCode: 400 };
    }
    return {
        data: {
            id: findSummary._id,
            psychologicalSummary: (0, encryption_1.decrypt)(findSummary.psychologicalSummary),
        },
        statusCode: 200,
    };
};
exports.getSummary = getSummary;
const getSummaryWithId = async ({ userId }) => {
    const findSummary = await summaryModel_1.default.findOne({ userId });
    if (!findSummary) {
        return { data: "summary not found", statusCode: 400 };
    }
    return {
        data: {
            id: findSummary._id,
            psychologicalSummary: (0, encryption_1.decrypt)(findSummary.psychologicalSummary),
        },
        statusCode: 200,
    };
};
exports.getSummaryWithId = getSummaryWithId;
const updateSummary = async ({ userId, psychologicalSummary, }) => {
    const findSummary = await summaryModel_1.default.findOne({ userId });
    if (!findSummary) {
        const newSummary = new summaryModel_1.default({
            userId,
            psychologicalSummary: (0, encryption_1.encrypt)(psychologicalSummary),
        });
        await newSummary.save();
        return { data: "A new summary has been added", statusCode: 200 };
    }
    findSummary.psychologicalSummary = (0, encryption_1.encrypt)(psychologicalSummary);
    await findSummary.save();
    return {
        data: {
            id: userId,
            psychologicalSummary: findSummary.psychologicalSummary,
        },
        statusCode: 200,
    };
};
exports.updateSummary = updateSummary;
//# sourceMappingURL=summaryService.js.map