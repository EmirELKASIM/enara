type AppointmentStatus = 'available' | 'booked';

export interface AppointmentTime {
  time: string;
  status: AppointmentStatus;
  price: string;
  coinType: string;
  duration: string;
}

export interface AppointmentDate {
  date: string;
  day: string;
  times: AppointmentTime[];
}

export interface UserInfoParams {
  accountType: string;
  permissible: boolean;
}
