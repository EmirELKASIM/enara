"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const appointmentModul_1 = __importDefault(require("../src/models/appointmentModul"));
const constants_1 = require("./constants");
/**
 * يحذف الأوقات المنتهية
 * ثم يحذف اليوم إذا لم يبق أي وقت
 */
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        const now = new Date();
        const appointments = await appointmentModul_1.default.find({
            status: { $nin: ["attendance"] },
        });
        for (const appointment of appointments) {
            // نحذف الأوقات المنتهية
            const validTimes = appointment.times.filter(t => {
                const dateTime = new Date(`${appointment.date} ${t.time}`);
                const expireTime = new Date(dateTime.getTime() +
                    (constants_1.SESSION_DURATION_MINUTES + constants_1.GRACE_MINUTES) * 60 * 1000);
                return now <= expireTime;
            });
            // إذا لم يبق أي وقت → نحذف اليوم كامل
            if (validTimes.length === 0) {
                await appointmentModul_1.default.findByIdAndDelete(appointment._id);
            }
            else if (validTimes.length !== appointment.times.length) {
                appointment.times = validTimes;
                await appointment.save();
            }
        }
    }
    catch (error) {
        console.error("Appointment cleanup error:", error);
    }
});
//# sourceMappingURL=appointmentCleanup.js.map