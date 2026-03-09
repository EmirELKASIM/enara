import mongoose, { Document } from "mongoose";
export interface IExperience extends Document {
    userId: mongoose.Types.ObjectId;
    experienceSummary: string;
    experienceDesc: string;
    certificates: string;
    language: string;
}
declare const experienceModel: mongoose.Model<IExperience, {}, {}, {}, mongoose.Document<unknown, {}, IExperience, {}, mongoose.DefaultSchemaOptions> & IExperience & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IExperience>;
export default experienceModel;
//# sourceMappingURL=experienceModel.d.ts.map