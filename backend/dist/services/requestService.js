"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequests = exports.deleteRequest = exports.updateRequest = exports.getInfoWithId = exports.getLinkedRequest = exports.getAcceptRequest = exports.getRequest = exports.sendRequest = void 0;
const helperJWT_1 = require("../middlewares/helperJWT");
const requestModel_1 = __importDefault(require("../models/requestModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendRequest = async ({ token, doctorId }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findPatient = await userModel_1.default.findById(tokenDetails.id);
    if (!findPatient) {
        return { data: "Patient Account not found!", statusCode: 400 };
    }
    const findDoctor = await userModel_1.default.findById(doctorId);
    if (!findDoctor) {
        return { data: "Doctor Account not found!", statusCode: 400 };
    }
    const doctorPhoneNumber = findDoctor.codeNumber + findDoctor.phoneNumber;
    const patientPhoneNumber = findPatient.codeNumber + findPatient.phoneNumber;
    const newRequests = new requestModel_1.default({
        patientId: tokenDetails.id,
        doctorId: doctorId,
        firstName: findPatient.firstName,
        lastName: findPatient.lastName,
        age: findPatient.age,
        patientPhoneNumber: patientPhoneNumber,
        doctorPhoneNumber: doctorPhoneNumber,
        doctorFirstName: findDoctor.firstName,
        doctorLastName: findDoctor.lastName,
        doctorAccountType: findDoctor.accountType,
        acceptedFromPatient: true,
    });
    await newRequests.save();
    return { data: newRequests, statusCode: 200 };
};
exports.sendRequest = sendRequest;
const getRequest = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findRequests = await requestModel_1.default.find({
        doctorId: tokenDetails.id,
        acceptedFromPatient: true,
        acceptedFromDoctor: false,
    });
    if (!findRequests) {
        return { data: "no Requests found!", statusCode: 400 };
    }
    return {
        data: findRequests,
        statusCode: 200,
    };
};
exports.getRequest = getRequest;
const getAcceptRequest = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findRequests = await requestModel_1.default.find({
        doctorId: tokenDetails.id,
        acceptedFromPatient: true,
        acceptedFromDoctor: true,
    });
    if (!findRequests) {
        return { data: "no Requests found!", statusCode: 400 };
    }
    return {
        data: findRequests,
        statusCode: 200,
    };
};
exports.getAcceptRequest = getAcceptRequest;
const getLinkedRequest = async ({ doctorId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findRequest = await requestModel_1.default.findOne({
        doctorId: doctorId,
        patientId: tokenDetails.id,
    });
    if (!findRequest) {
        return { data: "request not found", statusCode: 400 };
    }
    return { data: findRequest, statusCode: 200 };
};
exports.getLinkedRequest = getLinkedRequest;
const getInfoWithId = async ({ requestId }) => {
    const findFile = await requestModel_1.default.findOne({ _id: requestId });
    if (!findFile) {
        return { data: "File not found", statusCode: 400 };
    }
    return { data: findFile, statusCode: 200 };
};
exports.getInfoWithId = getInfoWithId;
const updateRequest = async ({ acceptedFromDoctor, requestId, }) => {
    if (acceptedFromDoctor === false) {
        const findRequestAndDelete = await requestModel_1.default.findByIdAndDelete(requestId);
        if (!findRequestAndDelete) {
            return { data: "request not found ", statusCode: 400 };
        }
        return { data: "deleted successfuly", statusCode: 200 };
    }
    const findRequest = await requestModel_1.default.findOneAndUpdate({
        _id: requestId,
        acceptedFromDoctor: false,
    }, {
        $set: { acceptedFromDoctor: acceptedFromDoctor },
    }, { new: true });
    if (!findRequest) {
        return { data: "Request not found", statusCode: 400 };
    }
    return { data: findRequest, statusCode: 200 };
};
exports.updateRequest = updateRequest;
const deleteRequest = async ({ requestId, patientId, }) => {
    const findRequest = await requestModel_1.default.findOneAndDelete({
        _id: requestId,
        patientId: patientId,
    });
    if (!findRequest) {
        return { data: "request not found", statusCode: 400 };
    }
    return { data: "request deleted", statusCode: 200 };
};
exports.deleteRequest = deleteRequest;
//------------------------------------------------------------------------------
const getAllRequests = async () => {
    const getRequests = await requestModel_1.default.find();
    if (!getRequests) {
        return { data: " requests not found ", statusCode: 400 };
    }
    return { data: getRequests, statusCode: 200 };
};
exports.getAllRequests = getAllRequests;
//# sourceMappingURL=requestService.js.map