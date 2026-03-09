import mongoose, { Document } from "mongoose";
export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    appointmentId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    doctorFirstName: string;
    doctorLastName: string;
    doctorAccountType: string;
    appointmentDate: string;
    appointmentDay: string;
    appointmentTime: string;
    meetingType: string;
    deletedFromUser: boolean;
    deletedFromDoctor: boolean;
    patientPhoneNumber: string;
    doctorPhoneNumber: string;
    isActive: boolean;
    meetingUrl: string;
    changeDetails: string;
    onChange: boolean;
    status: "booked" | "attendance" | "completed" | "canceled";
    appointmentDateTime: Date;
    reportInfo: Record<string, any>;
    appointmentPrice: string;
    appointmentCoinType: string;
    paymentStatus: boolean;
    dekontCode: string;
    dekontNotes: string;
}
declare const bookingModel: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
export default bookingModel;
//# sourceMappingURL=bookingModel.d.ts.map