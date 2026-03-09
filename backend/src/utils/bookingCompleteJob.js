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
    const activeBookings = await bookingModel_1.default.find({
        status: "attendance",
        isActive: true,
    });
    for (const booking of activeBookings) {
        const endTime = new Date(booking.appointmentDateTime.getTime() +
            constants_1.SESSION_DURATION_MINUTES * 60 * 1000);
        if (now > endTime) {
            booking.status = "completed";
            booking.isActive = false;
            await booking.save();
        }
    }
});
//# sourceMappingURL=bookingCompleteJob.js.map