import appointmentModel from "../models/appointmentModul";
import userModel from "../models/userModel";
import { verifyJWT } from "../../middlewares/helperJWT";
import bookingModel from "../models/bookingModel";

interface addAppointmentParams {
  token: any;
  time: string;
  date: string; 
  price: string;
  coinType: string;
}

export const addAppointment = async ({
  token,
  date,
  time,
  price,
  coinType,
}: addAppointmentParams) => {
  try {
    const tokenDetails = verifyJWT(token);
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
    const appointment = await appointmentModel.findOne({
      userId: tokenDetails.id,
      date,
      status: "pending",
    });

    if (appointment) {
      const timeExists = appointment.times.some((t: any) => t.time === time);

      if (timeExists) {
        return { data: "Time already exists", statusCode: 400 };
      }

      appointment.times.push({
        time,
        status: "pending",
        price: price,
        coinType: coinType,
      });

      appointment.times.sort((a: any, b: any) => a.time.localeCompare(b.time));

      await appointment.save();
      return { data: appointment, statusCode: 200 };
    }

    const findUser = await userModel.findById(tokenDetails.id);
    if (!findUser) {
      return { data: "User not found", statusCode: 400 };
    }

    const newAppointment = new appointmentModel({
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
        },
      ],
      status: "pending",
    });

    await newAppointment.save();

    return { data: newAppointment, statusCode: 200 };
  } catch (error) {
    console.error(error);
    return { data: "Server error", statusCode: 500 };
  }
};

export const getAppointments = async ({ token }: { token: any }) => {
  try {
    // التحقق من التوكن
    const tokenDetails = verifyJWT(token);
    if (!tokenDetails) {
      return { data: "Invalid token", statusCode: 401 };
    }

    // جلب الأيام مع الأوقات
    const appointments = await appointmentModel
      .find({ userId: tokenDetails.id, status: "pending" })
      .sort({ date: 1 });

    return {
      data: appointments,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      data: "Server error",
      statusCode: 500,
    };
  }
};

export const getAllApointment = async () => {
  const allAppointments = await appointmentModel.find().sort({ date: 1 });

  if (!allAppointments || allAppointments.length === 0) {
    return { data: "no appointments available", statusCode: 400 };
  }

  return { data: allAppointments, statusCode: 200 };
};

interface DeleteAppointmentParams {
  appointmentTime: string;
  appointmentDate: string;
  token: any;
}

export const deleteAppointment = async ({
  appointmentTime,
  appointmentDate,
  token,
}: DeleteAppointmentParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const updated = await appointmentModel.findOneAndUpdate(
    {
      userId: tokenDetails.id,
      date: appointmentDate,
      status: "pending",
    },
    {
      $pull: { times: { time: appointmentTime } },
    },
    { new: true },
  );

  if (!updated) {
    return { data: "appointment not found", statusCode: 404 };
  }

  if (updated.times.length === 0) {
    await appointmentModel.deleteOne({ _id: updated._id });
  }

  return { data: updated, statusCode: 200 };
};

interface DeleteDateParams {
  appointmentDate: string;
  token: any;
}

export const deleteDate = async ({
  appointmentDate,
  token,
}: DeleteDateParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  await appointmentModel.findOneAndDelete({
    userId: tokenDetails.id,
    date: appointmentDate,
    status: "pending",
  });
  return { data: "date deleted", statusCode: 200 };
};

//-------------------------------------------------------------------------

export const getApointments = async () => {
  const allAppointments = await appointmentModel.find();
  if (!allAppointments) {
    return { data: "appointments not found", statusCode: 400 };
  }
  return { data: allAppointments, statusCode: 200 };
};
