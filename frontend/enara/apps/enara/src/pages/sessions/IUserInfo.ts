export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  gender: string;
  maritalStatus: string;
  age: string;
}

export interface bookedAppointmentsInfo{
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
}