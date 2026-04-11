"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const node_cron_1 = __importDefault(require("node-cron"));
const sendUpcomingNotifications = async () => {
    const now = new Date();
    const halfHourLater = new Date(now.getTime() + 30 * 60 * 1000);
    const bookings = await bookingModel_1.default.find({
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
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        await sendUpcomingNotifications();
    }
    catch (error) {
        console.error("Error in Cron Job:", error);
    }
});
//# sourceMappingURL=sendUpcomingNotifications.js.map