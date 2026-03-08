import { verifyJWT } from "../../middlewares/helperJWT";
import examinationModel from "../models/examinationModel";
import userModel from "../models/userModel";
import { decrypt, encrypt } from "../../utils/encryption";

interface QuickNotes {
  suicide: string;
  appetite: string;
  sleep: string;
  mod: string;
}
interface medicines {
  doz: string;
  drugName: string;
  intakeNotes: string;
  drankMedicinesBefore: string;
  drugTimes: string[];
}
interface AddComplaintParams {
  token: any;
  patientId: string;
  complaint: string;
  complaintDuration: string;
  complaintSeverity: string;
  quickNotes: QuickNotes;
  medicines: medicines[];
  reportInfo: Record<string, any>;
  meetingType: string;
}

export const addComplaint = async ({
  token,
  patientId,
  complaint,
  complaintDuration,
  complaintSeverity,
  quickNotes,
  medicines,
  reportInfo,
  meetingType,
}: AddComplaintParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "token not found", statusCode: 400 };
  }
  const findUser = await userModel.findById(tokenDetails.id);
  if (!findUser) {
    return { data: " User not found", statusCode: 400 };
  }
  const encryptReportInfo = (reportInfo: Record<string, any>) => {
    const encrypted: Record<string, any> = {};

    for (const key in reportInfo) {
      const value = reportInfo[key];

      if (Array.isArray(value)) {
        // إذا كانت قيمة الحقل مصفوفة، شفر كل عنصر
        encrypted[key] = value.map((v) => encrypt(v));
      } else if (typeof value === "object" && value !== null) {
        // إذا كان object داخل object، استدعاء الدالة نفسها recursively
        encrypted[key] = encryptReportInfo(value);
      } else {
        // إذا كانت نص أو رقم، شفر مباشرة
        encrypted[key] = encrypt(value);
      }
    }

    return encrypted;
  };
  const newComplaint = new examinationModel({
    doctorId: tokenDetails.id,
    doctorFirstName: findUser.firstName,
    doctorLastName: findUser.lastName,
    doctorAccountType: findUser.accountType,
    patientId: patientId,
    complaint: encrypt(complaint),
    complaintDuration: encrypt(complaintDuration),
    complaintSeverity: encrypt(complaintSeverity),
    quickNotes: {
      suicide: encrypt(quickNotes.suicide),
      appetite: encrypt(quickNotes.appetite),
      sleep: encrypt(quickNotes.sleep),
      mod: encrypt(quickNotes.mod),
    },
    medicines: medicines.map((m) => ({
      doz: encrypt(m.doz),
      drugName: encrypt(m.drugName),
      intakeNotes: encrypt(m.intakeNotes),
      drankMedicinesBefore: encrypt(m.drankMedicinesBefore),
      drugTimes: m.drugTimes.map((t) => encrypt(t)),
    })),
    reportInfo: encryptReportInfo(reportInfo),
    meetingType: meetingType,
  });
  await newComplaint.save();
  if (!newComplaint) {
    return { data: "not found ", statusCode: 400 };
  }

  return { data: newComplaint, statusCode: 200 };
};

interface GetExaminationInfo {
  patientId: string;
  token: any;
}

export const getExaminationInfo = async ({
  patientId,
  token,
}: GetExaminationInfo) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "token not found", statusCode: 400 };
  }

  const examinations = await examinationModel.find({
    doctorId: tokenDetails.id,
    patientId: patientId,
  });

  if (!examinations || examinations.length === 0) {
    return { data: "Examination not found", statusCode: 400 };
  }
  const decryptReportInfo = (reportInfo: Record<string, any>) => {
    const decrypted: Record<string, any> = {};

    for (const key in reportInfo) {
      const value = reportInfo[key];

      if (Array.isArray(value)) {
        decrypted[key] = value.map((v) => decrypt(v));
      } else if (typeof value === "object" && value !== null) {
        decrypted[key] = decryptReportInfo(value);
      } else {
        decrypted[key] = decrypt(value);
      }
    }

    return decrypted;
  };
  // فك التشفير لكل عنصر
  const decryptedExaminations = examinations.map((exam) => ({
    ...exam.toObject(),
    complaint: decrypt(exam.complaint),
    complaintDuration: decrypt(exam.complaintDuration),
    complaintSeverity: decrypt(exam.complaintSeverity),
    quickNotes: {
      suicide: decrypt(exam.quickNotes.suicide),
      appetite: decrypt(exam.quickNotes.appetite),
      sleep: decrypt(exam.quickNotes.sleep),
      mod: decrypt(exam.quickNotes.mod),
    },
    medicines: exam.medicines.map((m) => ({
      doz: decrypt(m.doz),
      drugName: decrypt(m.drugName),
      intakeNotes: decrypt(m.intakeNotes),
      drankMedicinesBefore: decrypt(m.drankMedicinesBefore),
      drugTimes: m.drugTimes.map((t) => decrypt(t)),
    })),
    reportInfo: decryptReportInfo(exam.reportInfo),
  }));

  return { data: decryptedExaminations, statusCode: 200 };
};

export const getExaminationUserInfo = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "token not found", statusCode: 400 };
  }

  const findExaminations = await examinationModel.find({
    patientId: tokenDetails.id,
  });

  if (!findExaminations || findExaminations.length === 0) {
    return { data: "Examinations not found", statusCode: 400 };
  }
  const decryptReportInfo = (reportInfo: Record<string, any>) => {
    const decrypted: Record<string, any> = {};

    for (const key in reportInfo) {
      const value = reportInfo[key];

      if (Array.isArray(value)) {
        decrypted[key] = value.map((v) => decrypt(v));
      } else if (typeof value === "object" && value !== null) {
        decrypted[key] = decryptReportInfo(value);
      } else {
        decrypted[key] = decrypt(value);
      }
    }

    return decrypted;
  };
  // فك التشفير لكل عنصر بنفس الطريقة
  const decryptedExaminations = findExaminations.map((exam) => ({
    ...exam.toObject(),
    complaint: decrypt(exam.complaint),
    complaintDuration: decrypt(exam.complaintDuration),
    complaintSeverity: decrypt(exam.complaintSeverity),
    quickNotes: {
      suicide: decrypt(exam.quickNotes.suicide),
      appetite: decrypt(exam.quickNotes.appetite),
      sleep: decrypt(exam.quickNotes.sleep),
      mod: decrypt(exam.quickNotes.mod),
    },
    medicines: exam.medicines.map((m) => ({
      doz: decrypt(m.doz),
      drugName: decrypt(m.drugName),
      intakeNotes: decrypt(m.intakeNotes),
      drankMedicinesBefore: decrypt(m.drankMedicinesBefore),
      drugTimes: m.drugTimes.map((t) => decrypt(t)),
    })),
    reportInfo: decryptReportInfo(exam.reportInfo),
  }));

  return { data: decryptedExaminations, statusCode: 200 };
};

interface GetExaminationAndDelete {
  examinationId: string;
  patientId: string;
  doctorId: string;
}

export const getExaminationAndDelete = async ({
  examinationId,
  patientId,
  doctorId,
}: GetExaminationAndDelete) => {
  const findExamination = await examinationModel.findOneAndDelete({
    _id: examinationId,
    patientId: patientId,
    doctorId: doctorId,
  });
  if (!findExamination) {
    return { data: "examination not found", statusCode: 400 };
  }
  return {
    data: findExamination,
    statusCode: 200,
  };
};

//---------------------------------------------------------------------------
export const getAllExaminations = async () => {
  const allExaminations = await examinationModel.find();
  if (!allExaminations) {
    return { data: "examination not found", statusCode: 400 };
  }
  return {
    data: allExaminations,
    statusCode: 200,
  };
};
