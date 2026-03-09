import mongoose, { Document } from "mongoose";
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
}
declare const requestModel: mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRequest>;
export default requestModel;
//# sourceMappingURL=requestModel.d.ts.map