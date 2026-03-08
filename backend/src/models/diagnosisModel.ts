import mongoose, { Schema, Document } from "mongoose";

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

const diagnosisSchema = new Schema<IDiagnosis>(
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
    clinicalHistory: { type: String },
    sawDoctorBefore: { type: String },
    sleepedAtHospital: { type: String },
    drankMedicinesBefore: { type: String },
    diseaseName: { type: String },
    accompanyingDiagnoses: { type: String },
    diagnosesNotes: { type: String },
    severityOfDisorder: { type: String },
    durationOfDisorder: { type: String },
    riskLevel:[ { type: String }],
  },
  { timestamps: true },
);

const diagnosisModel = mongoose.model<IDiagnosis>("Diagnosis", diagnosisSchema);

export default diagnosisModel;
