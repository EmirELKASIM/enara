import mongoose, { Schema, Document } from "mongoose";

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
    duration: string;
    status: "pending" | "booked" | "attendance" | "canceled";
  }[];
  status: "pending" | "booked" | "attendance" | "canceled";
}

const appointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    accountType: { type: String, required: true },
    date: { type: String, required: true },
    day: { type: String, required: true },

    times: [
      {
        time: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "booked", "attendance", "canceled"],
          default: "pending",
          required: true,
        },
        price: { type: String, required: true },
        coinType: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "booked", "attendance", "canceled"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

const appointmentModel = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema,
);

export default appointmentModel;
