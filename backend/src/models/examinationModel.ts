import mongoose, { Schema, Document } from "mongoose";

export interface IExamination extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctorFirstName:string;
  doctorLastName:string;
  doctorAccountType:string;
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
    },
  ];
  meetingType:string;
  reportInfo: Record<string, any>;
}

const examinationSchema = new Schema<IExamination>(
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
    doctorFirstName: { type: String ,required: true, },
    doctorLastName: { type: String ,required: true, },
    doctorAccountType: { type: String ,required: true, },
    complaint: { type: String ,required: true, },
    complaintDuration: { type: String ,required: true,},
    complaintSeverity: { type: String ,required: true,},
    quickNotes: {
      mod: { type: String ,required: true,},
      sleep: { type: String ,required: true,},
      appetite: { type: String ,required: true,},
      suicide: { type: String ,required: true,},
    },
   
    medicines: [
      {
        doz: { type: String ,required: true,},
        drugName: { type: String ,required: true,},
        intakeNotes: { type: String ,required: true,},
        drankMedicinesBefore: { type: String ,required: true,},
        drugTimes: [{ type: String ,required: true,}],
      },
    ],
    reportInfo: {
      type: Schema.Types.Mixed,
      default: {},
    },
    meetingType: { type: String ,required: true,}
  },
  { timestamps: true },
);
const examinationModel = mongoose.model<IExamination>(
  "Examination",
  examinationSchema,
);

export default examinationModel;
