import mongoose, { Document } from "mongoose";
export interface IDiagnosis extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    clinicalHistory: string;
    sawDoctorBefore: string;
    sleepedAtHospital: string;
    drankMedicinesBefore: string;
    diseaseName: string;
    accompanyingDiagnoses: string;
    diagnosesNotes: string;
    severityOfDisorder: string;
    durationOfDisorder: string;
    riskLevel: string[];
}
declare const diagnosisModel: mongoose.Model<IDiagnosis, {}, {}, {}, mongoose.Document<unknown, {}, IDiagnosis, {}, mongoose.DefaultSchemaOptions> & IDiagnosis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDiagnosis>;
export default diagnosisModel;
//# sourceMappingURL=diagnosisModel.d.ts.map