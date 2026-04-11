import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    accountType: string;
    gender: string;
    birthday: string;
    age: string;
    maritalStatus: string;
    consultation: string;
    privacyPolicy: boolean;
    isEmailVerified: boolean;
    permissible: boolean;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default userModel;
//# sourceMappingURL=userModel.d.ts.map