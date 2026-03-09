"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiagnosis = exports.getDiagnosis = exports.addDiagnosis = void 0;
const helperJWT_1 = require("../middlewares/helperJWT");
const encryption_1 = require("../utils/encryption");
const diagnosisModel_1 = __importDefault(require("../models/diagnosisModel"));
const addDiagnosis = async ({ token, patientId, clinicalHistory, sawDoctorBefore, sleepedAtHospital, drankMedicinesBefore, diseaseName, accompanyingDiagnoses, diagnosesNotes, severityOfDisorder, durationOfDisorder, riskLevel, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const newDiagnosis = new diagnosisModel_1.default({
        doctorId: tokenDetails.id,
        patientId: patientId,
        clinicalHistory: (0, encryption_1.encrypt)(clinicalHistory),
        sawDoctorBefore: (0, encryption_1.encrypt)(sawDoctorBefore),
        sleepedAtHospital: (0, encryption_1.encrypt)(sleepedAtHospital),
        drankMedicinesBefore: (0, encryption_1.encrypt)(drankMedicinesBefore),
        diseaseName: (0, encryption_1.encrypt)(diseaseName),
        accompanyingDiagnoses: (0, encryption_1.encrypt)(accompanyingDiagnoses),
        diagnosesNotes: (0, encryption_1.encrypt)(diagnosesNotes),
        severityOfDisorder: (0, encryption_1.encrypt)(severityOfDisorder),
        durationOfDisorder: (0, encryption_1.encrypt)(durationOfDisorder),
        riskLevel: riskLevel.map((r) => (0, encryption_1.encrypt)(r)),
    });
    await newDiagnosis.save();
    return { data: newDiagnosis, statusCode: 200 };
};
exports.addDiagnosis = addDiagnosis;
const getDiagnosis = async ({ patientId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findDiagnosis = await diagnosisModel_1.default.findOne({
        patientId: patientId,
        doctorId: tokenDetails.id,
    });
    if (!findDiagnosis) {
        return { data: "Diagnosis not found", statusCode: 400 };
    }
    // فك التشفير لكل الحقول
    const decryptedDiagnosis = {
        ...findDiagnosis.toObject(),
        clinicalHistory: (0, encryption_1.decrypt)(findDiagnosis.clinicalHistory),
        sawDoctorBefore: (0, encryption_1.decrypt)(findDiagnosis.sawDoctorBefore),
        sleepedAtHospital: (0, encryption_1.decrypt)(findDiagnosis.sleepedAtHospital),
        drankMedicinesBefore: (0, encryption_1.decrypt)(findDiagnosis.drankMedicinesBefore),
        diseaseName: (0, encryption_1.decrypt)(findDiagnosis.diseaseName),
        accompanyingDiagnoses: (0, encryption_1.decrypt)(findDiagnosis.accompanyingDiagnoses),
        diagnosesNotes: (0, encryption_1.decrypt)(findDiagnosis.diagnosesNotes),
        severityOfDisorder: (0, encryption_1.decrypt)(findDiagnosis.severityOfDisorder),
        durationOfDisorder: (0, encryption_1.decrypt)(findDiagnosis.durationOfDisorder),
        riskLevel: findDiagnosis.riskLevel.map((r) => (0, encryption_1.decrypt)(r)),
    };
    return { data: decryptedDiagnosis, statusCode: 200 };
};
exports.getDiagnosis = getDiagnosis;
const updateDiagnosis = async ({ token, patientId, clinicalHistory, sawDoctorBefore, sleepedAtHospital, drankMedicinesBefore, diseaseName, accompanyingDiagnoses, diagnosesNotes, severityOfDisorder, durationOfDisorder, riskLevel, diagnosisId, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const existingDiagnosis = await diagnosisModel_1.default.findOne({
        _id: diagnosisId,
    });
    if (!existingDiagnosis) {
        return { data: "Diagnosis record not found", statusCode: 404 };
    }
    const findDiagnosis = await diagnosisModel_1.default.findOneAndUpdate({
        _id: diagnosisId,
    }, {
        $set: {
            clinicalHistory: (0, encryption_1.encrypt)(clinicalHistory),
            sawDoctorBefore: (0, encryption_1.encrypt)(sawDoctorBefore),
            sleepedAtHospital: (0, encryption_1.encrypt)(sleepedAtHospital),
            drankMedicinesBefore: (0, encryption_1.encrypt)(drankMedicinesBefore),
            diseaseName: (0, encryption_1.encrypt)(diseaseName),
            accompanyingDiagnoses: (0, encryption_1.encrypt)(accompanyingDiagnoses),
            diagnosesNotes: (0, encryption_1.encrypt)(diagnosesNotes),
            severityOfDisorder: (0, encryption_1.encrypt)(severityOfDisorder),
            durationOfDisorder: (0, encryption_1.encrypt)(durationOfDisorder),
            riskLevel: riskLevel.map((r) => (0, encryption_1.encrypt)(r)),
        },
    }, { new: true });
    if (!findDiagnosis) {
        return { data: "something went wrong", statusCode: 400 };
    }
    return { data: findDiagnosis, statusCode: 200 };
};
exports.updateDiagnosis = updateDiagnosis;
//# sourceMappingURL=diagnosisService.js.map