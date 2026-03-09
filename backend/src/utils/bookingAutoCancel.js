"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const bookingModel_1 = __importDefault(require("../src/models/bookingModel"));
const constants_1 = require("./constants");
node_cron_1.default.schedule("* * * * *", async () => {
    const now = new Date();
    const bookings = await bookingModel_1.default.find({
        status: "booked",
        isActive: false,
    });
    for (const booking of bookings) {
        const expireTime = new Date(booking.appointmentDateTime.getTime() +
            (constants_1.SESSION_DURATION_MINUTES + constants_1.GRACE_MINUTES) * 60 * 1000);
        if (now > expireTime && booking.status !== "canceled") {
            booking.status = "canceled";
            await booking.save();
        }
    }
});
//# sourceMappingURL=bookingAutoCancel.js.map