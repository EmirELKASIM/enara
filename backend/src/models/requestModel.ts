import mongoose, { Schema, Document } from "mongoose";
export interface INotification {
  type: "sent" | "accepted" | "deleted";
  message: string;
  sent: boolean;
  sentAt?: Date;
  readByDoctor: boolean;
  readByPatient: boolean;
  createdAt: Date;
}
export interface IRequest extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorAccountType: string;
  patientPhoneNumber: string;
  doctorPhoneNumber: string;
  patientSummary: string;
  acceptedFromPatient: boolean;
  acceptedFromDoctor: boolean;
  notifications: INotification[];
}

const requestSchema = new Schema<IRequest>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    doctorFirstName: { type: String, required: true },
    doctorLastName: { type: String, required: true },
    doctorAccountType: { type: String, required: true },
    patientPhoneNumber: { type: String, required: true },
    doctorPhoneNumber: { type: String, required: true },
    patientSummary: { type: String },
    acceptedFromPatient: { type: Boolean, default: false },
    acceptedFromDoctor: { type: Boolean, default: false },
    notifications: [
      {
        type: {
          type: String,
          enum: ["sent", "accepted", "canceled"],
          required: true,
        },
        message: { type: String, required: true },
        sent: { type: Boolean, default: false },
        sentAt: { type: Date },
        readByDoctor: { type: Boolean, default: false },
        readByPatient: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const requestModel = mongoose.model<IRequest>("Request", requestSchema);

export default requestModel;
