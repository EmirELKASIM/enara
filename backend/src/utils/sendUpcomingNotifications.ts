import bookingModel from "../models/bookingModel";
import cron from "node-cron";

const sendUpcomingNotifications = async () => {
  const now = new Date();
  const halfHourLater = new Date(now.getTime() + 30 * 60 * 1000);

  const bookings = await bookingModel.find({
    appointmentDateTime: { $gte: now, $lte: halfHourLater },
    status: "booked",
    notifications: { 
      $not: { $elemMatch: { type: "upcoming" } } 
    },
  });

  for (const booking of bookings) {
    booking.notifications.push({
      type: "upcoming",
      message: "Your appointment is coming up in 30 minutes",
      sent: true,
      sentAt: new Date(),
      readByDoctor: false,
      readByPatient: false,
      createdAt: new Date(),
    });

    await booking.save();
  }

  if (bookings.length > 0) {
    console.log(`[Cron] ${bookings.length} upcoming notifications added.`);
  }
};

cron.schedule("* * * * *", async () => {
  try {
    await sendUpcomingNotifications();
  } catch (error) {
    console.error("Error in Cron Job:", error);
  }
});