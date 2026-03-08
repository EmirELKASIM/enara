import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  experienceSummary: string;
  experienceDesc:string;
  certificates:string;
  language:string;
}

const experienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experienceSummary: { type: String,  required: true },
    experienceDesc: { type: String , required: true},
    certificates: {type: String, required: true},
    language: {type: String,required: true}
  },
  { timestamps: true }
);

const experienceModel = mongoose.model<IExperience>("Experience", experienceSchema);

export default experienceModel;
