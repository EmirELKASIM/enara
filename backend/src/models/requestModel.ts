import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorAccountType: string;
  patientPhoneNumber:string;
  doctorPhoneNumber:string;
  patientSummary:string;
  acceptedFromPatient:boolean;
  acceptedFromDoctor:boolean;
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
    acceptedFromPatient: {type:Boolean, default:false},
    acceptedFromDoctor: {type:Boolean, default:false},
  },
  { timestamps: true }
);

const requestModel = mongoose.model<IRequest>("Request", requestSchema);

export default requestModel;
