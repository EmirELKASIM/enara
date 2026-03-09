import mongoose, { Document } from "mongoose";
export interface ISummary extends Document {
    userId: mongoose.Types.ObjectId;
    psychologicalSummary: string;
}
declare const summaryModel: mongoose.Model<ISummary, {}, {}, {}, mongoose.Document<unknown, {}, ISummary, {}, mongoose.DefaultSchemaOptions> & ISummary & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISummary>;
export default summaryModel;
//# sourceMappingURL=summaryModel.d.ts.map