import { parseIsolatedEntityName } from "typescript";
import { verifyJWT } from "../middlewares/helperJWT";
import appointmentModel from "../models/appointmentModul";
import bookingModel from "../models/bookingModel";
import userModel from "../models/userModel";

interface addBookingParams {
  appointmentId: string;
  appointmentTime: string;
  appointmentDay: string;
  appointmentDate: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorAccountType: string;
  doctorId: string;
  meetingType: string;
  token: any;
  reportInfo: string;
  appointmentPrice: string;
  appointmentCoinType: string;
  appointmentDuration: string;
}

export const addBooking = async ({
  appointmentId,
  appointmentTime,
  appointmentDate,
  appointmentDay,
  doctorFirstName,
  doctorLastName,
  doctorAccountType,
  meetingType,
  doctorId,
  token,
  reportInfo,
  appointmentPrice,
  appointmentCoinType,
  appointmentDuration,
}: addBookingParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findUser = await userModel.findById(tokenDetails.id);
  if (!findUser) {
    return { data: "User not found", statusCode: 400 };
  }
  const findAppointment = await appointmentModel.findOneAndUpdate(
    {
      userId: doctorId,
      date: appointmentDate,
      times: {
        $elemMatch: {
          time: appointmentTime,
          status: "pending",
        },
      },
    },
    {
      $set: {
        "times.$.status": "booked",
      },
    },
    { new: true },
  );

  if (!findAppointment) {
    return { data: "Appointment not found", statusCode: 400 };
  }

  await findAppointment.save();
  const existingBooking = await bookingModel.findOne({
    doctorId,
    appointmentDate,
    appointmentTime,
    status: "booked",
  });

  if (existingBooking) {
    return { data: "This appointment is already booked", statusCode: 400 };
  }
  const appointmentDateTime = new Date(
    `${appointmentDate}T${appointmentTime}:00`,
  );
  const findDoctor = await userModel.findById(doctorId);
  if (!findDoctor) {
    return { data: "doctor account not found", statusCode: 400 };
  }

  const newBooking = new bookingModel({
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

export const getBookedForUser = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBookedAppointment = await bookingModel.find({
    userId: tokenDetails.id,
    status: { $in: ["booked", "attendance"] },
  });
  if (!findBookedAppointment) {
    return { data: "no Appointment booked", statusCode: 400 };
  }
  return { data: findBookedAppointment, statusCode: 200 };
};

export const getBookedForDoctor = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBookedAppointment = await bookingModel.find({
    doctorId: tokenDetails.id,
    status: { $in: ["booked", "attendance"] },
  });
  if (!findBookedAppointment) {
    return { data: "no Appointment booked", statusCode: 400 };
  }
  return { data: findBookedAppointment, statusCode: 200 };
};

interface ReportInfo {
  token: any;
  patientId: string;
}

export const getReportInfo = async ({ token, patientId }: ReportInfo) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBooking = await bookingModel.find({
    userId: patientId,
    doctorId: tokenDetails.id,
    status: "booked",
  });
  if (!findBooking) {
    return { data: "no Appointment booked", statusCode: 400 };
  }
  return { data: findBooking, statusCode: 200 };
};

export const getHistoryForUser = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBookedAppointment = await bookingModel
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

export const getHistoryForDoctor = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findBookedAppointment = await bookingModel
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

interface GetDekontDetailsParams {
  appointmentId: string;
  patientId: string;
  token: any;
}
export const getDekontDetails = async ({
  token,
  patientId,
  appointmentId,
}: GetDekontDetailsParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBooking = await bookingModel.findOne({
    _id: appointmentId,
    userId: patientId,
    doctorId: tokenDetails.id,
  });

  if (!findBooking) {
    return { data: "no Appointment found", statusCode: 400 };
  }
  return { data: findBooking, statusCode: 200 };
};
interface onCanceledParams {
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: string;
  token: any;
}
export const onCanceled = async ({
  token,
  appointmentId,
  appointmentDate,
  appointmentTime,
  doctorId,
}: onCanceledParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findBookedAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      status: { $in: ["booked", "attendance"] },
    },
    {
      $set: {
        status: "canceled",
      },
    },
    { new: true },
  );
  if (!findBookedAppointment) {
    return { data: "appointment not found", statusCode: 400 };
  }
  await appointmentModel.findOneAndUpdate(
    {
      userId: doctorId,
      date: appointmentDate,
      times: {
        $elemMatch: {
          time: appointmentTime,
          status: "booked",
        },
      },
    },
    {
      $set: {
        "times.$.status": "pending",
      },
    },
    { new: true },
  );
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

interface onUserHistoryDelete {
  appointmentId: string;
  token: any;
}
export const onUserHistoryDelete = async ({
  appointmentId,
  token,
}: onUserHistoryDelete) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      userId: tokenDetails.id,
      deletedFromUser: false,
    },
    {
      $set: {
        deletedFromUser: true,
      },
    },
  );

  if (!findAppointment) {
    return { data: "Appointment not found", statusCode: 400 };
  }

  return { data: findAppointment, statusCode: 200 };
};

interface onDoctorHistoryDelete {
  appointmentId: string;
  token: any;
}
export const onDoctorHistoryDelete = async ({
  appointmentId,
  token,
}: onDoctorHistoryDelete) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      doctorId: tokenDetails.id,
      deletedFromDoctor: false,
    },
    {
      $set: {
        deletedFromDoctor: true,
      },
    },
  );

  if (!findAppointment) {
    return { data: "Appointment not found", statusCode: 400 };
  }

  return { data: findAppointment, statusCode: 200 };
};

interface onIsActiveParams {
  token: any;
  appointmentId: string;
  meetingUrl: string;
}

export const onIsActive = async ({
  token,
  appointmentId,
  meetingUrl,
}: onIsActiveParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findAppointment = await bookingModel.findOneAndUpdate(
    {
      doctorId: tokenDetails.id,
      _id: appointmentId,
      meetingUrl: "",
      isActive: false,
    },
    {
      $set: {
        isActive: true,
        status: "attendance",
        meetingUrl: meetingUrl,
      },
    },
  );
  if (!findAppointment) {
    return { data: "appointment not found", statusCode: 400 };
  }

  return { data: findAppointment, statusCode: 200 };
};

interface getActiveAppointment {
  token: any;
  appointmentId: string;
}

export const getActiveAppointment = async ({
  token,
  appointmentId,
}: getActiveAppointment) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findAppointment = await bookingModel.findOne({
    userId: tokenDetails.id,
    _id: appointmentId,
    isActive: true,
  });
  if (!findAppointment) {
    return { data: "appointment not found", statusCode: 400 };
  }
  return { data: findAppointment, statusCode: 200 };
};
export const getNotifications = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const forDoctor = await userModel.findById(tokenDetails.id);

  let bookings;

  if (forDoctor?.accountType !== "personal") {
    bookings = await bookingModel
      .find({
        doctorId: tokenDetails.id,
      })
      .sort({ createdAt: -1 });
  } else {
    bookings = await bookingModel
      .find({
        userId: tokenDetails.id,
      })
      .sort({ createdAt: -1 });
  }

  const accountType = forDoctor?.accountType;

  const notifications = bookings
    .flatMap((b: any) => {
      if (!b.notifications || b.notifications.length === 0) return [];
      return b.notifications.map((n: any) => ({
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
    .filter((n: any) => {
      if (accountType !== "personal") {
        // للطبيب
        return ["booked", "canceled", "toChange", "paid", "upcoming"].includes(
          n.type,
        );
      } else {
        // للمريض
        return ["canceled", "changed", "acceptedPaid", "upcoming"].includes(
          n.type,
        );
      }
    })
    .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0));
  return {
    data: notifications,
    statusCode: 200,
  };
};

interface ReadNotParams {
  token: any;
  bookingId: string;
  notificationId: string;
}
export const readNotifications = async ({
  token,
  bookingId,
  notificationId,
}: ReadNotParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const user = await userModel.findById(tokenDetails.id);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  const fieldToUpdate =
    user.accountType !== "personal"
      ? "notifications.$.readByDoctor"
      : "notifications.$.readByPatient";

  const result = await bookingModel.updateOne(
    { _id: bookingId, "notifications._id": notificationId },
    { $set: { [fieldToUpdate]: true } },
  );

  if (result.matchedCount === 0) {
    return { data: "Booking or notification not found", statusCode: 404 };
  }

  return {
    data: "Notification marked as read",
    statusCode: 200,
  };
};

interface UpdateBookingParams {
  token: any;
  newAppointmentId: string;
  bookingId: string;
  newTime: string;
  newDate: string;
  newDay: string;
  newDuration: string;
}
export const updateBooking = async ({
  token,
  bookingId,
  newAppointmentId,
  newTime,
  newDate,
  newDay,
  newDuration,
}: UpdateBookingParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 401 };
  }

  //  جلب الحجز الحالي
  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    return { data: "Booking not found", statusCode: 404 };
  }

  //  فك الحجز عن الموعد القديم
  await appointmentModel.updateOne(
    {
      _id: booking.appointmentId,
      "times.time": booking.appointmentTime,
      "times.status": "booked",
    },
    {
      $set: {
        "times.$.status": "pending",
      },
    },
  );

  //  حجز الموعد الجديد
  const newAppointment = await appointmentModel.updateOne(
    {
      _id: newAppointmentId,
      "times.time": newTime,
      "times.status": "pending",
    },
    {
      $set: {
        "times.$.status": "booked",
      },
    },
  );

  if (newAppointment.matchedCount === 0) {
    return { data: "New time not available", statusCode: 400 };
  }

  // تحديث الحجز
  const updatedBooking = await bookingModel.findOneAndUpdate(
    {
      _id: bookingId,
      doctorId: tokenDetails.id,
    },
    {
      appointmentId: newAppointmentId,
      appointmentTime: newTime,
      appointmentDate: newDate,
      appointmentDay: newDay,
      appointmentDuration: newDuration,
    },
    { new: true },
  );
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
interface ChangeBookingParams {
  changeDetails: string;
  appointmentId: string;
  token: any;
}

export const changeBooking = async ({
  appointmentId,
  changeDetails,
  token,
}: ChangeBookingParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 401 };
  }

  const updatedAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      userId: tokenDetails.id,
    },
    {
      $set: {
        changeDetails,
        onChange: true,
      },
    },
    { new: true },
  );

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

interface SendDekontParams {
  dekontCode: string;
  dekontNotes: string;
  appointmentId: string;
  token: any;
}
export const sendDekont = async ({
  dekontCode,
  dekontNotes,
  appointmentId,
  token,
}: SendDekontParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 401 };
  }

  const updatedAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      userId: tokenDetails.id,
    },
    {
      $set: {
        dekontCode,
        dekontNotes,
      },
    },
    { new: true },
  );

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

interface AcceptedDekontParams {
  appointmentId: string;
  patientId: string;
  token: any;
}

export const acceptedDekont = async ({
  appointmentId,
  patientId,
  token,
}: AcceptedDekontParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 401 };
  }

  const updatedAppointment = await bookingModel.findOneAndUpdate(
    {
      _id: appointmentId,
      userId: patientId,
      doctorId: tokenDetails.id,
    },
    {
      $set: {
        paymentMethod: "byDekont",
      },
    },
    { new: true },
  );

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

interface PaidCardParams {
  appointmentId: string;
  token: any;
  doctorId: String;
}
export const paidByCard = async ({
  appointmentId,
  doctorId,
  token,
}: PaidCardParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 401 };
  }
  const findBooking = await bookingModel.findOneAndUpdate(
    {
      userId: tokenDetails.id,
      doctorId: doctorId,
      appointmentId: appointmentId,
      paymentMethod: "none",
    },
    {
      $set: { paymentMethod: "card" },
    },
  );
  if (!findBooking) {
    return { data: "Booking not found", statusCode: 404 };
  }
  return { data: findBooking, statusCode: 200 };
};
//--------------------------------------------------------------------------

export const getAllBookings = async () => {
  const allBookings = await bookingModel.find();
  if (!allBookings) {
    return { data: "booking not found", statusCode: 400 };
  }
  return { data: allBookings, statusCode: 200 };
};
