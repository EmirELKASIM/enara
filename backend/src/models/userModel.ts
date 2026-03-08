import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  codeNumber: string;
  accountType: string;
  gender: string;
  birthday: string;
  age: string;
  maritalStatus: string;
  consultation: string;
  privacyPolicy: boolean;
  isEmailVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    codeNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: String, required: true },
    age: { type: String },
    maritalStatus: { type: String, required: true },
    consultation: { type: String, required: true },
    privacyPolicy: { type: Boolean, required: true },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
