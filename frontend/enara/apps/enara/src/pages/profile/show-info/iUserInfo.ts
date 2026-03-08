export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  gender: string;
  maritalStatus: string;
  age: string;
  phoneNumber: string;
  codeNumber: string;
}

export interface SummaryInfo {
  psychologicalSummary: string;
}

export interface experienceInfo {
  experienceSummary: string;
  experienceDesc: string;
  certificates: string;
  language: string;
}

export interface bookedAppointmentsInfo {
  _id: string;
  firstName: string;
  lastName: string;
  userId:string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorAccountType: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentTime: string;
  doctorPhoneNumber: string;
  patientPhoneNumber: string;
  meetingType: string;
  age: string;
  isActive: boolean;
  onChange: boolean;
  changeDetails: string;
  appointmentPrice: string;
  appointmentCoinType: string;
  paymentStatus:string;
  dekontCode:string;
}
