import cron from "node-cron";
import bookingModel from "../models/bookingModel";
import { SESSION_DURATION_MINUTES, GRACE_MINUTES } from "./constants";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const bookings = await bookingModel.find({
    status: "booked",
    isActive: false,
  });

  
  for (const booking of bookings) {
    const expireTime = new Date(
      booking.appointmentDateTime.getTime() +
        (SESSION_DURATION_MINUTES + GRACE_MINUTES) * 60 * 1000,
    );
   
    if (now > expireTime && booking.status !== "canceled") {
      booking.status = "canceled";
      await booking.save();
    }
  }
});
