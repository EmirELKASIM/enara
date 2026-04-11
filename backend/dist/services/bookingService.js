"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.paidByCard = exports.acceptedDekont = exports.sendDekont = exports.changeBooking = exports.updateBooking = exports.readNotifications = exports.getNotifications = exports.getActiveAppointment = exports.onIsActive = exports.onDoctorHistoryDelete = exports.onUserHistoryDelete = exports.onCanceled = exports.getDekontDetails = exports.getHistoryForDoctor = exports.getHistoryForUser = exports.getReportInfo = exports.getBookedForDoctor = exports.getBookedForUser = exports.addBooking = void 0;
const helperJWT_1 = require("../middlewares/helperJWT");
const appointmentModul_1 = __importDefault(require("../models/appointmentModul"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const addBooking = async ({ appointmentId, appointmentTime, appointmentDate, appointmentDay, doctorFirstName, doctorLastName, doctorAccountType, meetingType, doctorId, token, reportInfo, appointmentPrice, appointmentCoinType, appointmentDuration, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findUser = await userModel_1.default.findById(tokenDetails.id);
    if (!findUser) {
        return { data: "User not found", statusCode: 400 };
    }
    const findAppointment = await appointmentModul_1.default.findOneAndUpdate({
        userId: doctorId,
        date: appointmentDate,
        times: {
            $elemMatch: {
                time: appointmentTime,
                status: "pending",
            },
        },
    }, {
        $set: {
            "times.$.status": "booked",
        },
    }, { new: true });
    if (!findAppointment) {
        return { data: "Appointment not found", statusCode: 400 };
    }
    await findAppointment.save();
    const existingBooking = await bookingModel_1.default.findOne({
        doctorId,
        appointmentDate,
        appointmentTime,
        status: "booked",
    });
    if (existingBooking) {
        return { data: "This appointment is already booked", statusCode: 400 };
    }
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const findDoctor = await userModel_1.default.findById(doctorId);
    if (!findDoctor) {
        return { data: "doctor account not found", statusCode: 400 };
    }
    const newBooking = new bookingModel_1.default({
        appointmentId: appointmentId,
        appointmentTime: appointmentTime,
        appointmentDay: appointmentDay,
        appointmentDate: appointmentDate,
        doctorFirstName: doctorFirstName,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        doctorLastName: doctorLastName,
        doctorAccountType: doctorAccountType,
        meetingType: meetingType,
        doctorPhoneNumber: findDoctor.phoneNumber,
        patientPhoneNumber: findUser.phoneNumber,
        doctorId: doctorId,
        userId: tokenDetails.id,
        status: "booked",
        appointmentDateTime: appointmentDateTime,
        reportInfo: reportInfo,
        appointmentPrice: appointmentPrice,
        appointmentCoinType: appointmentCoinType,
        appointmentDuration: appointmentDuration,
        notifications: [
            {
                type: "booked",
                message: "موعد جديد",
                sent: true,
                sentAt: new Date(),
                read: false,
            },
        ],
    });
    await newBooking.save();
    return {
        data: newBooking,
        statusCode: 200,
    };
};
exports.addBooking = addBooking;
const getBookedForUser = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBookedAppointment = await bookingModel_1.default.find({
        userId: tokenDetails.id,
        status: { $in: ["booked", "attendance"] },
    });
    if (!findBookedAppointment) {
        return { data: "no Appointment booked", statusCode: 400 };
    }
    return { data: findBookedAppointment, statusCode: 200 };
};
exports.getBookedForUser = getBookedForUser;
const getBookedForDoctor = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBookedAppointment = await bookingModel_1.default.find({
        doctorId: tokenDetails.id,
        status: { $in: ["booked", "attendance"] },
    });
    if (!findBookedAppointment) {
        return { data: "no Appointment booked", statusCode: 400 };
    }
    return { data: findBookedAppointment, statusCode: 200 };
};
exports.getBookedForDoctor = getBookedForDoctor;
const getReportInfo = async ({ token, patientId }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBooking = await bookingModel_1.default.find({
        userId: patientId,
        doctorId: tokenDetails.id,
        status: "booked",
    });
    if (!findBooking) {
        return { data: "no Appointment booked", statusCode: 400 };
    }
    return { data: findBooking, statusCode: 200 };
};
exports.getReportInfo = getReportInfo;
const getHistoryForUser = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBookedAppointment = await bookingModel_1.default
        .find({
        userId: tokenDetails.id,
        status: { $in: ["canceled", "attendance", "completed"] },
        deletedFromUser: false,
    })
        .sort({ createdAt: -1 });
    if (!findBookedAppointment) {
        return { data: "no Appointment canceled or attendance", statusCode: 400 };
    }
    return { data: findBookedAppointment, statusCode: 200 };
};
exports.getHistoryForUser = getHistoryForUser;
const getHistoryForDoctor = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBookedAppointment = await bookingModel_1.default
        .find({
        doctorId: tokenDetails.id,
        status: { $in: ["canceled", "attendance", "completed"] },
        deletedFromDoctor: false,
    })
        .sort({ createdAt: -1 });
    if (!findBookedAppointment) {
        return { data: "no Appointment canceled or attendance", statusCode: 400 };
    }
    return { data: findBookedAppointment, statusCode: 200 };
};
exports.getHistoryForDoctor = getHistoryForDoctor;
const getDekontDetails = async ({ token, patientId, appointmentId, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBooking = await bookingModel_1.default.findOne({
        _id: appointmentId,
        userId: patientId,
        doctorId: tokenDetails.id,
    });
    if (!findBooking) {
        return { data: "no Appointment found", statusCode: 400 };
    }
    return { data: findBooking, statusCode: 200 };
};
exports.getDekontDetails = getDekontDetails;
const onCanceled = async ({ token, appointmentId, appointmentDate, appointmentTime, doctorId, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findBookedAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        status: { $in: ["booked", "attendance"] },
    }, {
        $set: {
            status: "canceled",
        },
    }, { new: true });
    if (!findBookedAppointment) {
        return { data: "appointment not found", statusCode: 400 };
    }
    await appointmentModul_1.default.findOneAndUpdate({
        userId: doctorId,
        date: appointmentDate,
        times: {
            $elemMatch: {
                time: appointmentTime,
                status: "booked",
            },
        },
    }, {
        $set: {
            "times.$.status": "pending",
        },
    }, { new: true });
    findBookedAppointment.notifications.push({
        type: "canceled", // نوع الإشعار
        message: "موعد ملغي", // الرسالة
        sent: true,
        sentAt: new Date(),
        readByDoctor: false,
        readByPatient: false,
        createdAt: new Date(),
    });
    await findBookedAppointment.save();
    return {
        data: findBookedAppointment,
        statusCode: 200,
    };
};
exports.onCanceled = onCanceled;
const onUserHistoryDelete = async ({ appointmentId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        userId: tokenDetails.id,
        deletedFromUser: false,
    }, {
        $set: {
            deletedFromUser: true,
        },
    });
    if (!findAppointment) {
        return { data: "Appointment not found", statusCode: 400 };
    }
    return { data: findAppointment, statusCode: 200 };
};
exports.onUserHistoryDelete = onUserHistoryDelete;
const onDoctorHistoryDelete = async ({ appointmentId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        doctorId: tokenDetails.id,
        deletedFromDoctor: false,
    }, {
        $set: {
            deletedFromDoctor: true,
        },
    });
    if (!findAppointment) {
        return { data: "Appointment not found", statusCode: 400 };
    }
    return { data: findAppointment, statusCode: 200 };
};
exports.onDoctorHistoryDelete = onDoctorHistoryDelete;
const onIsActive = async ({ token, appointmentId, meetingUrl, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findAppointment = await bookingModel_1.default.findOneAndUpdate({
        doctorId: tokenDetails.id,
        _id: appointmentId,
        meetingUrl: "",
        isActive: false,
    }, {
        $set: {
            isActive: true,
            status: "attendance",
            meetingUrl: meetingUrl,
        },
    });
    if (!findAppointment) {
        return { data: "appointment not found", statusCode: 400 };
    }
    return { data: findAppointment, statusCode: 200 };
};
exports.onIsActive = onIsActive;
const getActiveAppointment = async ({ token, appointmentId, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const findAppointment = await bookingModel_1.default.findOne({
        userId: tokenDetails.id,
        _id: appointmentId,
        isActive: true,
    });
    if (!findAppointment) {
        return { data: "appointment not found", statusCode: 400 };
    }
    return { data: findAppointment, statusCode: 200 };
};
exports.getActiveAppointment = getActiveAppointment;
const getNotifications = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const forDoctor = await userModel_1.default.findById(tokenDetails.id);
    let bookings;
    if (forDoctor?.accountType !== "personal") {
        bookings = await bookingModel_1.default
            .find({
            doctorId: tokenDetails.id,
        })
            .sort({ createdAt: -1 });
    }
    else {
        bookings = await bookingModel_1.default
            .find({
            userId: tokenDetails.id,
        })
            .sort({ createdAt: -1 });
    }
    const accountType = forDoctor?.accountType;
    const notifications = bookings
        .flatMap((b) => {
        if (!b.notifications || b.notifications.length === 0)
            return [];
        return b.notifications.map((n) => ({
            _id: n._id,
            type: n.type,
            message: n.message,
            sent: n.sent,
            sentAt: n.sentAt,
            read: accountType !== "personal" ? n.readByDoctor : n.readByPatient,
            appointmentDate: b.appointmentDate,
            appointmentTime: b.appointmentTime,
            bookingId: b._id,
        }));
    })
        .filter((n) => {
        if (accountType !== "personal") {
            // للطبيب
            return ["booked", "canceled", "toChange", "paid", "upcoming"].includes(n.type);
        }
        else {
            // للمريض
            return ["canceled", "changed", "acceptedPaid", "upcoming"].includes(n.type);
        }
    })
        .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0));
    return {
        data: notifications,
        statusCode: 200,
    };
};
exports.getNotifications = getNotifications;
const readNotifications = async ({ token, bookingId, notificationId, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 400 };
    }
    const user = await userModel_1.default.findById(tokenDetails.id);
    if (!user) {
        return { data: "User not found", statusCode: 404 };
    }
    const fieldToUpdate = user.accountType !== "personal"
        ? "notifications.$.readByDoctor"
        : "notifications.$.readByPatient";
    const result = await bookingModel_1.default.updateOne({ _id: bookingId, "notifications._id": notificationId }, { $set: { [fieldToUpdate]: true } });
    if (result.matchedCount === 0) {
        return { data: "Booking or notification not found", statusCode: 404 };
    }
    return {
        data: "Notification marked as read",
        statusCode: 200,
    };
};
exports.readNotifications = readNotifications;
const updateBooking = async ({ token, bookingId, newAppointmentId, newTime, newDate, newDay, newDuration, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 401 };
    }
    //  جلب الحجز الحالي
    const booking = await bookingModel_1.default.findById(bookingId);
    if (!booking) {
        return { data: "Booking not found", statusCode: 404 };
    }
    //  فك الحجز عن الموعد القديم
    await appointmentModul_1.default.updateOne({
        _id: booking.appointmentId,
        "times.time": booking.appointmentTime,
        "times.status": "booked",
    }, {
        $set: {
            "times.$.status": "pending",
        },
    });
    //  حجز الموعد الجديد
    const newAppointment = await appointmentModul_1.default.updateOne({
        _id: newAppointmentId,
        "times.time": newTime,
        "times.status": "pending",
    }, {
        $set: {
            "times.$.status": "booked",
        },
    });
    if (newAppointment.matchedCount === 0) {
        return { data: "New time not available", statusCode: 400 };
    }
    // تحديث الحجز
    const updatedBooking = await bookingModel_1.default.findOneAndUpdate({
        _id: bookingId,
        doctorId: tokenDetails.id,
    }, {
        appointmentId: newAppointmentId,
        appointmentTime: newTime,
        appointmentDate: newDate,
        appointmentDay: newDay,
        appointmentDuration: newDuration,
    }, { new: true });
    if (updatedBooking) {
        updatedBooking.notifications.push({
            type: "changed",
            message: "تم تغيير الموعد",
            sent: true,
            sentAt: new Date(),
            readByDoctor: false,
            readByPatient: false,
            createdAt: new Date(),
        });
        await updatedBooking.save();
    }
    return {
        data: updatedBooking,
        statusCode: 200,
    };
};
exports.updateBooking = updateBooking;
const changeBooking = async ({ appointmentId, changeDetails, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 401 };
    }
    const updatedAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        userId: tokenDetails.id,
    }, {
        $set: {
            changeDetails,
            onChange: true,
        },
    }, { new: true });
    if (!updatedAppointment) {
        return { data: "Appointment not found", statusCode: 404 };
    }
    updatedAppointment.notifications.push({
        type: "toChange",
        message: "طلب صداقة",
        sent: true,
        sentAt: new Date(),
        readByDoctor: false,
        readByPatient: false,
        createdAt: new Date(),
    });
    await updatedAppointment.save();
    return { data: updatedAppointment, statusCode: 200 };
};
exports.changeBooking = changeBooking;
const sendDekont = async ({ dekontCode, dekontNotes, appointmentId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 401 };
    }
    const updatedAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        userId: tokenDetails.id,
    }, {
        $set: {
            dekontCode,
            dekontNotes,
        },
    }, { new: true });
    if (!updatedAppointment) {
        return { data: "Appointment not found", statusCode: 404 };
    }
    updatedAppointment.notifications.push({
        type: "paid",
        message: "تم الدفع",
        sent: true,
        sentAt: new Date(),
        readByDoctor: false,
        readByPatient: false,
        createdAt: new Date(),
    });
    await updatedAppointment.save();
    return { data: updatedAppointment, statusCode: 200 };
};
exports.sendDekont = sendDekont;
const acceptedDekont = async ({ appointmentId, patientId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 401 };
    }
    const updatedAppointment = await bookingModel_1.default.findOneAndUpdate({
        _id: appointmentId,
        userId: patientId,
        doctorId: tokenDetails.id,
    }, {
        $set: {
            paymentMethod: "byDekont",
        },
    }, { new: true });
    if (!updatedAppointment) {
        return { data: "Appointment not found", statusCode: 404 };
    }
    updatedAppointment.notifications.push({
        type: "acceptedPaid",
        message: "تمت الموافقة على الدقع",
        sent: true,
        sentAt: new Date(),
        readByDoctor: false,
        readByPatient: false,
        createdAt: new Date(),
    });
    await updatedAppointment.save();
    return { data: updatedAppointment, statusCode: 200 };
};
exports.acceptedDekont = acceptedDekont;
const paidByCard = async ({ appointmentId, doctorId, token, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return { data: "Invalid token", statusCode: 401 };
    }
    const findBooking = await bookingModel_1.default.findOneAndUpdate({
        userId: tokenDetails.id,
        doctorId: doctorId,
        appointmentId: appointmentId,
        paymentMethod: "none",
    }, {
        $set: { paymentMethod: "card" },
    });
    if (!findBooking) {
        return { data: "Booking not found", statusCode: 404 };
    }
    return { data: findBooking, statusCode: 200 };
};
exports.paidByCard = paidByCard;
//--------------------------------------------------------------------------
const getAllBookings = async () => {
    const allBookings = await bookingModel_1.default.find();
    if (!allBookings) {
        return { data: "booking not found", statusCode: 400 };
    }
    return { data: allBookings, statusCode: 200 };
};
exports.getAllBookings = getAllBookings;
//# sourceMappingURL=bookingService.js.map