import mongoose, { Schema, Document } from "mongoose";

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
  patientPhoneNumber:string;
  doctorPhoneNumber:string;
  isActive: boolean;
  meetingUrl: string;
  changeDetails: string;
  onChange: boolean;
  status: "booked" | "attendance" | "completed" | "canceled";
  appointmentDateTime: Date;
  reportInfo: Record<string, any>;
  appointmentPrice:string;
  appointmentCoinType:string;
  paymentStatus: boolean;
  dekontCode:string;
  dekontNotes:string;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    doctorFirstName: { type: String, required: true },
    doctorLastName: { type: String, required: true },
    doctorAccountType: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentDay: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    meetingType: { type: String, required: true },
    deletedFromUser: { type: Boolean, default: false },
    deletedFromDoctor: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    patientPhoneNumber: { type: String, required: true },
    doctorPhoneNumber: { type: String, required: true },
    meetingUrl: { type: String, default: "" },
    changeDetails: { type: String, default: "" },
    onChange: { type: Boolean, default: false },
    paymentStatus: { type: Boolean, default: false },
    dekontCode: { type: String, default: "" },
    dekontNotes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["booked", "attendance", "completed", "canceled"],
      default: "booked",
      required: true,
    },
    appointmentDateTime: { type: Date, required: true },
    reportInfo: {
      type: Schema.Types.Mixed,
      default: {},
    },
    appointmentPrice:{ type: String, required: true },
  appointmentCoinType:{ type: String, required: true },
  },
  { timestamps: true },
);

const bookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

export default bookingModel;
