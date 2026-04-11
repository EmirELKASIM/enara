"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApointments = exports.deleteDate = exports.deleteAppointment = exports.getAllApointment = exports.getAppointments = exports.addAppointment = void 0;
const appointmentModul_1 = __importDefault(require("../models/appointmentModul"));
const userModel_1 = __importDefault(require("../models/userModel"));
const helperJWT_1 = require("../middlewares/helperJWT");
const addAppointment = async ({ token, date, time, price, coinType, duration }) => {
    try {
        const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
        if (!tokenDetails) {
            return { data: "Invalid token", statusCode: 401 };
        }
        //  تحقق بسيط من الصيغة
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return { data: "Invalid date format", statusCode: 400 };
        }
        if (!/^\d{2}:\d{2}$/.test(time)) {
            return { data: "Invalid time format", statusCode: 400 };
        }
        //  حساب اسم اليوم (Local بدون UTC)
        const dayName = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            weekday: "long",
        });
        // البحث عن اليوم
        const appointment = await appointmentModul_1.default.findOne({
            userId: tokenDetails.id,
            date,
            status: "pending",
        });
        if (appointment) {
            const timeExists = appointment.times.some((t) => t.time === time);
            if (timeExists) {
                return { data: "Time already exists", statusCode: 400 };
            }
            appointment.times.push({
                time,
                status: "pending",
                price: price,
                coinType: coinType,
                duration: duration
            });
            appointment.times.sort((a, b) => a.time.localeCompare(b.time));
            await appointment.save();
            return { data: appointment, statusCode: 200 };
        }
        const findUser = await userModel_1.default.findById(tokenDetails.id);
        if (!findUser) {
            return { data: "User not found", statusCode: 400 };
        }
        const newAppointment = new appointmentModul_1.default({
            userId: tokenDetails.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            accountType: findUser.accountType,
            date,
            day: dayName,
            times: [
                {
                    time,
                    status: "pending",
                    price: price,
                    coinType: coinType,
                    duration: duration
                },
            ],
            status: "pending",
        });
        await newAppointment.save();
        return { data: newAppointment, statusCode: 200 };
    }
    catch (error) {
        console.error(error);
        return { data: "Server error", statusCode: 500 };
    }
};
exports.addAppointment = addAppointment;
const getAppointments = async ({ token }) => {
    try {
        // التحقق من التوكن
        const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
        if (!tokenDetails) {
            return { data: "Invalid token", statusCode: 401 };
        }
        // جلب الأيام مع الأوقات
        const appointments = await appointmentModul_1.default
            .find({ userId: tokenDetails.id, status: "pending" })
            .sort({ date: 1 });
        return {
            data: appointments,
            statusCode: 200,
        };
    }
    catch (error) {
        console.error(error);
        return {
            data: "Server error",
            statusCode: 500,
        };
    }
};
exports.getAppointments = getAppointments;
const getAllApointment = async () => {
    const allAppointments = await appointmentModul_1.default.find().sort({ date: 1 });
    if (!allAppointments || allAppointments.length === 0) {
        return { data: "no appointments available", statusCode: 400 };
    }
    return { data: allAppointments, statusCode: 200 };
};
exports.getAllApointment = getAllApointment;
const deleteAppointment = async ({ appointmentTime, appointmentDate, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const updated = await appointmentModul_1.default.findOneAndUpdate({
        userId: tokenDetails.id,
        date: appointmentDate,
        status: "pending",
    }, {
        $pull: { times: { time: appointmentTime } },
    }, { new: true });
    if (!updated) {
        return { data: "appointment not found", statusCode: 404 };
    }
    if (updated.times.length === 0) {
        await appointmentModul_1.default.deleteOne({ _id: updated._id });
    }
    return { data: updated, statusCode: 200 };
};
exports.deleteAppointment = deleteAppointment;
const deleteDate = async ({ appointmentDate, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    await appointmentModul_1.default.findOneAndDelete({
        userId: tokenDetails.id,
        date: appointmentDate,
        status: "pending",
    });
    return { data: "date deleted", statusCode: 200 };
};
exports.deleteDate = deleteDate;
//-------------------------------------------------------------------------
const getApointments = async () => {
    const allAppointments = await appointmentModul_1.default.find();
    if (!allAppointments) {
        return { data: "appointments not found", statusCode: 400 };
    }
    return { data: allAppointments, statusCode: 200 };
};
exports.getApointments = getApointments;
//# sourceMappingURL=appointmentService.js.map