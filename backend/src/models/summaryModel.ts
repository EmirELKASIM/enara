import mongoose, { Schema, Document } from "mongoose";

export interface ISummary extends Document {
  userId: mongoose.Types.ObjectId;
  psychologicalSummary: string;
  
}

const summarySchema = new Schema<ISummary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    psychologicalSummary: { type: String, required: true },
  },
  { timestamps: true }
);

const summaryModel = mongoose.model<ISummary>("Summary", summarySchema);

export default summaryModel;
