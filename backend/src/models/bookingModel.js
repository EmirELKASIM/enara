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
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    appointmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    doctorFirstName: { type: String, required: true },
    doctorLastName: { type: String, required: true },
    doctorAccountType: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentDay: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    meetingType: { type: String, required: true },
    deletedFromUser: { type: Boolean, default: false },
    deletedFromDoctor: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    patientPhoneNumber: { type: String, required: true },
    doctorPhoneNumber: { type: String, required: true },
    meetingUrl: { type: String, default: "" },
    changeDetails: { type: String, default: "" },
    onChange: { type: Boolean, default: false },
    paymentStatus: { type: Boolean, default: false },
    dekontCode: { type: String, default: "" },
    dekontNotes: { type: String, default: "" },
    status: {
        type: String,
        enum: ["booked", "attendance", "completed", "canceled"],
        default: "booked",
        required: true,
    },
    appointmentDateTime: { type: Date, required: true },
    reportInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    appointmentPrice: { type: String, required: true },
    appointmentCoinType: { type: String, required: true },
}, { timestamps: true });
const bookingModel = mongoose_1.default.model("Booking", bookingSchema);
exports.default = bookingModel;
//# sourceMappingURL=bookingModel.js.map