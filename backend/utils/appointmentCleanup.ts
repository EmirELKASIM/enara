import cron from "node-cron";
import appointmentModel from "../src/models/appointmentModul";
import { SESSION_DURATION_MINUTES, GRACE_MINUTES } from "./constants";

/**
 * يحذف الأوقات المنتهية
 * ثم يحذف اليوم إذا لم يبق أي وقت
 */
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const appointments = await appointmentModel.find({
      status: { $nin: ["attendance"] },
    });

    for (const appointment of appointments) {

      // نحذف الأوقات المنتهية
      const validTimes = appointment.times.filter(t => {
        const dateTime = new Date(`${appointment.date} ${t.time}`);

        const expireTime = new Date(
          dateTime.getTime() +
          (SESSION_DURATION_MINUTES + GRACE_MINUTES) * 60 * 1000
        );

        return now <= expireTime;
      });

      // إذا لم يبق أي وقت → نحذف اليوم كامل
      if (validTimes.length === 0) {
        await appointmentModel.findByIdAndDelete(appointment._id);
      } else if (validTimes.length !== appointment.times.length) {
        appointment.times = validTimes;
        await appointment.save();
      }
    }

  } catch (error) {
    console.error("Appointment cleanup error:", error);
  }
});
