"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExaminations = exports.getExaminationAndDelete = exports.getExaminationUserInfo = exports.getExaminationInfo = exports.addComplaint = void 0;
const helperJWT_1 = require("../../middlewares/helperJWT");
const examinationModel_1 = __importDefault(require("../models/examinationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const encryption_1 = require("../../utils/encryption");
const addComplaint = async ({ token, patientId, complaint, complaintDuration, complaintSeverity, quickNotes, medicines, reportInfo, meetingType, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "token not found", statusCode: 400 };
    }
    const findUser = await userModel_1.default.findById(tokenDetails.id);
    if (!findUser) {
        return { data: " User not found", statusCode: 400 };
    }
    const encryptReportInfo = (reportInfo) => {
        const encrypted = {};
        for (const key in reportInfo) {
            const value = reportInfo[key];
            if (Array.isArray(value)) {
                // إذا كانت قيمة الحقل مصفوفة، شفر كل عنصر
                encrypted[key] = value.map((v) => (0, encryption_1.encrypt)(v));
            }
            else if (typeof value === "object" && value !== null) {
                // إذا كان object داخل object، استدعاء الدالة نفسها recursively
                encrypted[key] = encryptReportInfo(value);
            }
            else {
                // إذا كانت نص أو رقم، شفر مباشرة
                encrypted[key] = (0, encryption_1.encrypt)(value);
            }
        }
        return encrypted;
    };
    const newComplaint = new examinationModel_1.default({
        doctorId: tokenDetails.id,
        doctorFirstName: findUser.firstName,
        doctorLastName: findUser.lastName,
        doctorAccountType: findUser.accountType,
        patientId: patientId,
        complaint: (0, encryption_1.encrypt)(complaint),
        complaintDuration: (0, encryption_1.encrypt)(complaintDuration),
        complaintSeverity: (0, encryption_1.encrypt)(complaintSeverity),
        quickNotes: {
            suicide: (0, encryption_1.encrypt)(quickNotes.suicide),
            appetite: (0, encryption_1.encrypt)(quickNotes.appetite),
            sleep: (0, encryption_1.encrypt)(quickNotes.sleep),
            mod: (0, encryption_1.encrypt)(quickNotes.mod),
        },
        medicines: medicines.map((m) => ({
            doz: (0, encryption_1.encrypt)(m.doz),
            drugName: (0, encryption_1.encrypt)(m.drugName),
            intakeNotes: (0, encryption_1.encrypt)(m.intakeNotes),
            drankMedicinesBefore: (0, encryption_1.encrypt)(m.drankMedicinesBefore),
            drugTimes: m.drugTimes.map((t) => (0, encryption_1.encrypt)(t)),
        })),
        reportInfo: encryptReportInfo(reportInfo),
        meetingType: meetingType,
    });
    await newComplaint.save();
    if (!newComplaint) {
        return { data: "not found ", statusCode: 400 };
    }
    return { data: newComplaint, statusCode: 200 };
};
exports.addComplaint = addComplaint;
const getExaminationInfo = async ({ patientId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "token not found", statusCode: 400 };
    }
    const examinations = await examinationModel_1.default.find({
        doctorId: tokenDetails.id,
        patientId: patientId,
    });
    if (!examinations || examinations.length === 0) {
        return { data: "Examination not found", statusCode: 400 };
    }
    const decryptReportInfo = (reportInfo) => {
        const decrypted = {};
        for (const key in reportInfo) {
            const value = reportInfo[key];
            if (Array.isArray(value)) {
                decrypted[key] = value.map((v) => (0, encryption_1.decrypt)(v));
            }
            else if (typeof value === "object" && value !== null) {
                decrypted[key] = decryptReportInfo(value);
            }
            else {
                decrypted[key] = (0, encryption_1.decrypt)(value);
            }
        }
        return decrypted;
    };
    // فك التشفير لكل عنصر
    const decryptedExaminations = examinations.map((exam) => ({
        ...exam.toObject(),
        complaint: (0, encryption_1.decrypt)(exam.complaint),
        complaintDuration: (0, encryption_1.decrypt)(exam.complaintDuration),
        complaintSeverity: (0, encryption_1.decrypt)(exam.complaintSeverity),
        quickNotes: {
            suicide: (0, encryption_1.decrypt)(exam.quickNotes.suicide),
            appetite: (0, encryption_1.decrypt)(exam.quickNotes.appetite),
            sleep: (0, encryption_1.decrypt)(exam.quickNotes.sleep),
            mod: (0, encryption_1.decrypt)(exam.quickNotes.mod),
        },
        medicines: exam.medicines.map((m) => ({
            doz: (0, encryption_1.decrypt)(m.doz),
            drugName: (0, encryption_1.decrypt)(m.drugName),
            intakeNotes: (0, encryption_1.decrypt)(m.intakeNotes),
            drankMedicinesBefore: (0, encryption_1.decrypt)(m.drankMedicinesBefore),
            drugTimes: m.drugTimes.map((t) => (0, encryption_1.decrypt)(t)),
        })),
        reportInfo: decryptReportInfo(exam.reportInfo),
    }));
    return { data: decryptedExaminations, statusCode: 200 };
};
exports.getExaminationInfo = getExaminationInfo;
const getExaminationUserInfo = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "token not found", statusCode: 400 };
    }
    const findExaminations = await examinationModel_1.default.find({
        patientId: tokenDetails.id,
    });
    if (!findExaminations || findExaminations.length === 0) {
        return { data: "Examinations not found", statusCode: 400 };
    }
    const decryptReportInfo = (reportInfo) => {
        const decrypted = {};
        for (const key in reportInfo) {
            const value = reportInfo[key];
            if (Array.isArray(value)) {
                decrypted[key] = value.map((v) => (0, encryption_1.decrypt)(v));
            }
            else if (typeof value === "object" && value !== null) {
                decrypted[key] = decryptReportInfo(value);
            }
            else {
                decrypted[key] = (0, encryption_1.decrypt)(value);
            }
        }
        return decrypted;
    };
    // فك التشفير لكل عنصر بنفس الطريقة
    const decryptedExaminations = findExaminations.map((exam) => ({
        ...exam.toObject(),
        complaint: (0, encryption_1.decrypt)(exam.complaint),
        complaintDuration: (0, encryption_1.decrypt)(exam.complaintDuration),
        complaintSeverity: (0, encryption_1.decrypt)(exam.complaintSeverity),
        quickNotes: {
            suicide: (0, encryption_1.decrypt)(exam.quickNotes.suicide),
            appetite: (0, encryption_1.decrypt)(exam.quickNotes.appetite),
            sleep: (0, encryption_1.decrypt)(exam.quickNotes.sleep),
            mod: (0, encryption_1.decrypt)(exam.quickNotes.mod),
        },
        medicines: exam.medicines.map((m) => ({
            doz: (0, encryption_1.decrypt)(m.doz),
            drugName: (0, encryption_1.decrypt)(m.drugName),
            intakeNotes: (0, encryption_1.decrypt)(m.intakeNotes),
            drankMedicinesBefore: (0, encryption_1.decrypt)(m.drankMedicinesBefore),
            drugTimes: m.drugTimes.map((t) => (0, encryption_1.decrypt)(t)),
        })),
        reportInfo: decryptReportInfo(exam.reportInfo),
    }));
    return { data: decryptedExaminations, statusCode: 200 };
};
exports.getExaminationUserInfo = getExaminationUserInfo;
const getExaminationAndDelete = async ({ examinationId, patientId, doctorId, }) => {
    const findExamination = await examinationModel_1.default.findOneAndDelete({
        _id: examinationId,
        patientId: patientId,
        doctorId: doctorId,
    });
    if (!findExamination) {
        return { data: "examination not found", statusCode: 400 };
    }
    return {
        data: findExamination,
        statusCode: 200,
    };
};
exports.getExaminationAndDelete = getExaminationAndDelete;
//---------------------------------------------------------------------------
const getAllExaminations = async () => {
    const allExaminations = await examinationModel_1.default.find();
    if (!allExaminations) {
        return { data: "examination not found", statusCode: 400 };
    }
    return {
        data: allExaminations,
        statusCode: 200,
    };
};
exports.getAllExaminations = getAllExaminations;
//# sourceMappingURL=examinationService.js.map