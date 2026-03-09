import mongoose, { Document } from "mongoose";
export interface IExamination extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    doctorFirstName: string;
    doctorLastName: string;
    doctorAccountType: string;
    complaint: string;
    complaintDuration: string;
    complaintSeverity: string;
    quickNotes: {
        mod: string;
        sleep: string;
        appetite: string;
        suicide: string;
    };
    medicines: [
        {
            doz: string;
            drugName: string;
            intakeNotes: string;
            drankMedicinesBefore: string;
            drugTimes: string[];
        }
    ];
    meetingType: string;
    reportInfo: Record<string, any>;
}
declare const examinationModel: mongoose.Model<IExamination, {}, {}, {}, mongoose.Document<unknown, {}, IExamination, {}, mongoose.DefaultSchemaOptions> & IExamination & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IExamination>;
export default examinationModel;
//# sourceMappingURL=examinationModel.d.ts.map