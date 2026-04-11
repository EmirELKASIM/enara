
export interface DoctorEarnings {
  doctorName: string;
  bookings: any[];
  completedCount: number;
}

export interface AllBookings {
  firstName: string;
  lastName: string;
  doctorFirstName: string;
  doctorLastName: string;
  status: string;
  paymentStatus: boolean;
  appointmentPrice: string;
  appointmentCoinType: string;
  createdAt: string;
}