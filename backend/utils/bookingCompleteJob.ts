import cron from "node-cron";
import bookingModel from "../src/models/bookingModel";
import {
  SESSION_DURATION_MINUTES,
} from "./constants";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const activeBookings = await bookingModel.find({
    status: "attendance",
    isActive: true,
  });

  for (const booking of activeBookings) {
    const endTime = new Date(
      booking.appointmentDateTime.getTime() +
        SESSION_DURATION_MINUTES * 60 * 1000
    );

    if (now > endTime) {
      booking.status = "completed";
      booking.isActive = false;
      await booking.save();
    }
  }
});
