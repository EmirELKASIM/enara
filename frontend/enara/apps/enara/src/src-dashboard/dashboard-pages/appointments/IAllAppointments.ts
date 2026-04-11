interface appointmentTimes {
  time: string;
  status: string;
  price: string;
  coinType: string;
}

export interface AllAppointments {
  firstName: string;
  lastName: string;
  times: appointmentTimes[];
  createdAt:string;
}
