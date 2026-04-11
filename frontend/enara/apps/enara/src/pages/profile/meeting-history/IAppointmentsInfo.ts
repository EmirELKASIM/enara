export interface HistoryAppointmentsInfo {
  _id:string
  firstName:string;
  lastName: string;
  doctorId: string;
  doctorFirstName:string;
  doctorLastName:string;
  doctorAccountType:string;
  appointmentDate:string;
  appointmentDay:string;
  appointmentTime:string;
  meetingType:string;
  status:string;
  appointmentPrice: string;
  appointmentCoinType: string;
  paymentMethod:string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  gender: string;
  maritalStatus: string;
  age: string;
}
