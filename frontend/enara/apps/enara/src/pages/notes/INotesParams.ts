export interface BackgroundStatus {
  clinicalHistory: string;
  sawDoctorBefore: string;
  sleepedAtHospital: string;
  drankMedicinesBefore: string;
}
export interface DiagnosisParams {
  diseaseName: string;
  diagnosesNotes: string;
  accompanyingDiagnoses: string;
  severityOfDisorder: string;
  durationOfDisorder: string;
  riskLevel: string[];
}

export interface RequestInfo {
  _id: string;
  firstName: string;
  lastName: string;
  age: string;
}

export interface Medicine {
  doz: string;
  drugName: string;
  intakeNotes: string;
  drankMedicinesBefore: string;
  drugTimes: string[];
}

export interface TreatmentParams {
  medicines: Medicine[];
}
export interface MainComplaintParams {
  complaint: string;
  complaintDuration: string;
  complaintSeverity: string;
}
export interface QuickNotesDetails {
  mod: string;
  sleep: string;
  appetite: string;
  suicide: string;
}
export interface ReportInfo {
   reportInfo:any;
   meetingType:string;
}

export interface diagnosisInfo{
  _id:string;
}