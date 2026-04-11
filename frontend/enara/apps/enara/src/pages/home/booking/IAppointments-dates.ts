export interface AppointmentTime {
  time: string;       
  status: string;      
  price: string;      
  coinType: string; 
  duration:string;   
}

export interface Appointment {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  accountType: string;
  date: string;
  day: string;
  status: string;
  times: AppointmentTime[];
  createdAt: string;
  updatedAt: string;
}