import mongoose, { Document } from "mongoose";
export interface IAppointment extends Document {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    accountType: string;
    day: string;
    date: string;
    times: {
        time: string;
        price: string;
        coinType: string;
        status: "pending" | "booked" | "attendance" | "canceled";
    }[];
    status: "pending" | "booked" | "attendance" | "canceled";
}
declare const appointmentModel: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, mongoose.DefaultSchemaOptions> & IAppointment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAppointment>;
export default appointmentModel;
//# sourceMappingURL=appointmentModul.d.ts.map