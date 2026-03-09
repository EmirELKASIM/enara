import { verifyJWT } from "../middlewares/helperJWT";
import { decrypt, encrypt } from "../utils/encryption";
import diagnosisModel from "../models/diagnosisModel";

interface addDiagnosisParams {
  token: any;
  patientId: string;
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

export const addDiagnosis = async ({
  token,
  patientId,
  clinicalHistory,
  sawDoctorBefore,
  sleepedAtHospital,
  drankMedicinesBefore,
  diseaseName,
  accompanyingDiagnoses,
  diagnosesNotes,
  severityOfDisorder,
  durationOfDisorder,
  riskLevel,
}: addDiagnosisParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const newDiagnosis = new diagnosisModel({
    doctorId: tokenDetails.id,
    patientId: patientId,
    clinicalHistory: encrypt(clinicalHistory),
    sawDoctorBefore: encrypt(sawDoctorBefore),
    sleepedAtHospital: encrypt(sleepedAtHospital),
    drankMedicinesBefore: encrypt(drankMedicinesBefore),
    diseaseName: encrypt(diseaseName),
    accompanyingDiagnoses: encrypt(accompanyingDiagnoses),
    diagnosesNotes: encrypt(diagnosesNotes),
    severityOfDisorder: encrypt(severityOfDisorder),
    durationOfDisorder: encrypt(durationOfDisorder),
    riskLevel: riskLevel.map((r) => encrypt(r)),
  });
  await newDiagnosis.save();
  return { data: newDiagnosis, statusCode: 200 };
};

interface getDiagnosisParams {
  token: any;
  patientId: string;
}
export const getDiagnosis = async ({
  patientId,
  token,
}: getDiagnosisParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const findDiagnosis = await diagnosisModel.findOne({
    patientId: patientId,
    doctorId: tokenDetails.id,
  });

  if (!findDiagnosis) {
    return { data: "Diagnosis not found", statusCode: 400 };
  }

  // فك التشفير لكل الحقول
  const decryptedDiagnosis = {
    ...findDiagnosis.toObject(),
    clinicalHistory: decrypt(findDiagnosis.clinicalHistory),
    sawDoctorBefore: decrypt(findDiagnosis.sawDoctorBefore),
    sleepedAtHospital: decrypt(findDiagnosis.sleepedAtHospital),
    drankMedicinesBefore: decrypt(findDiagnosis.drankMedicinesBefore),
    diseaseName: decrypt(findDiagnosis.diseaseName),
    accompanyingDiagnoses: decrypt(findDiagnosis.accompanyingDiagnoses),
    diagnosesNotes: decrypt(findDiagnosis.diagnosesNotes),
    severityOfDisorder: decrypt(findDiagnosis.severityOfDisorder),
    durationOfDisorder: decrypt(findDiagnosis.durationOfDisorder),
    riskLevel: findDiagnosis.riskLevel.map((r: string) => decrypt(r)),
  };

  return { data: decryptedDiagnosis, statusCode: 200 };
};

interface UpdateDiagnosisParams {
  diagnosisId: string;
  token: any;
  patientId: string;
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

export const updateDiagnosis = async ({
  token,
  patientId,
  clinicalHistory,
  sawDoctorBefore,
  sleepedAtHospital,
  drankMedicinesBefore,
  diseaseName,
  accompanyingDiagnoses,
  diagnosesNotes,
  severityOfDisorder,
  durationOfDisorder,
  riskLevel,
  diagnosisId,
}: UpdateDiagnosisParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const existingDiagnosis = await diagnosisModel.findOne({
    _id: diagnosisId,
  });

  if (!existingDiagnosis) {
    return { data: "Diagnosis record not found", statusCode: 404 };
  }

  const findDiagnosis = await diagnosisModel.findOneAndUpdate(
    {
      _id: diagnosisId,
    },
    {
      $set: {
        clinicalHistory: encrypt(clinicalHistory),
        sawDoctorBefore: encrypt(sawDoctorBefore),
        sleepedAtHospital: encrypt(sleepedAtHospital),
        drankMedicinesBefore: encrypt(drankMedicinesBefore),
        diseaseName: encrypt(diseaseName),
        accompanyingDiagnoses: encrypt(accompanyingDiagnoses),
        diagnosesNotes: encrypt(diagnosesNotes),
        severityOfDisorder: encrypt(severityOfDisorder),
        durationOfDisorder: encrypt(durationOfDisorder),
        riskLevel: riskLevel.map((r) => encrypt(r)),
      },
    },
    { new: true },
  );
  if (!findDiagnosis) {
    return { data: "something went wrong", statusCode: 400 };
  }

  return { data: findDiagnosis, statusCode: 200 };
};
