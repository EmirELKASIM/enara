"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExperience = exports.getExperienceWithId = exports.getExperience = exports.addExperience = void 0;
const helperJWT_1 = require("../../middlewares/helperJWT");
const experienceModel_1 = __importDefault(require("../models/experienceModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const addExperience = async ({ userId, experienceSummary, experienceDesc, certificates, language, }) => {
    const findUser = await userModel_1.default.findById(userId);
    if (!findUser) {
        return { data: "User not found", statusCode: 401 };
    }
    const newExperience = new experienceModel_1.default({
        userId,
        experienceSummary,
        experienceDesc,
        certificates,
        language,
    });
    await newExperience.save();
    return { data: newExperience, statusCode: 200 };
};
exports.addExperience = addExperience;
const getExperience = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return {
            data: "Invalid token",
            statusCode: 400,
        };
    }
    const findExperience = await experienceModel_1.default.findOne({
        userId: tokenDetails.id,
    });
    if (!findExperience) {
        return { data: "Put expertise on your account", statusCode: 200 };
    }
    return {
        data: {
            id: findExperience._id,
            experienceSummary: findExperience.experienceSummary,
            experienceDesc: findExperience.experienceDesc,
            certificates: findExperience.certificates,
            language: findExperience.language,
        },
        statusCode: 200,
    };
};
exports.getExperience = getExperience;
const getExperienceWithId = async ({ userId }) => {
    const findExperience = await experienceModel_1.default.findOne({
        userId
    });
    if (!findExperience) {
        return { data: "expertise not found", statusCode: 200 };
    }
    return {
        data: {
            id: findExperience._id,
            experienceSummary: findExperience.experienceSummary,
            experienceDesc: findExperience.experienceDesc,
            certificates: findExperience.certificates,
            language: findExperience.language,
        },
        statusCode: 200,
    };
};
exports.getExperienceWithId = getExperienceWithId;
const updateExperience = async ({ userId, experienceSummary, experienceDesc, certificates, language, }) => {
    const findExperience = await experienceModel_1.default.findOne({ userId });
    if (!findExperience) {
        const newExperience = new experienceModel_1.default({
            userId,
            experienceSummary,
            experienceDesc,
            certificates,
            language,
        });
        await newExperience.save();
        return { data: "New experience has been added", statusCode: 200 };
    }
    findExperience.experienceSummary = experienceSummary;
    findExperience.experienceDesc = experienceDesc;
    findExperience.certificates = certificates;
    findExperience.language = language;
    await findExperience.save();
    return {
        data: {
            id: userId,
            experienceSummary: findExperience.experienceSummary,
            experienceDesc: findExperience.experienceDesc,
            certificates: findExperience.certificates,
            language: findExperience.language
        },
        statusCode: 200,
    };
};
exports.updateExperience = updateExperience;
//# sourceMappingURL=experienceService.js.map