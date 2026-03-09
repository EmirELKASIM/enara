"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const examinationSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorFirstName: { type: String, required: true, },
    doctorLastName: { type: String, required: true, },
    doctorAccountType: { type: String, required: true, },
    complaint: { type: String, required: true, },
    complaintDuration: { type: String, required: true, },
    complaintSeverity: { type: String, required: true, },
    quickNotes: {
        mod: { type: String, required: true, },
        sleep: { type: String, required: true, },
        appetite: { type: String, required: true, },
        suicide: { type: String, required: true, },
    },
    medicines: [
        {
            doz: { type: String, required: true, },
            drugName: { type: String, required: true, },
            intakeNotes: { type: String, required: true, },
            drankMedicinesBefore: { type: String, required: true, },
            drugTimes: [{ type: String, required: true, }],
        },
    ],
    reportInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    meetingType: { type: String, required: true, }
}, { timestamps: true });
const examinationModel = mongoose_1.default.model("Examination", examinationSchema);
exports.default = examinationModel;
//# sourceMappingURL=examinationModel.js.map