export interface AllBookings{
    firstName:string;
    lastName:string;
    doctorFirstName:string;
    doctorLastName:string;
    status:string;
    createdAt:string;
}
export interface DoctorBookingGroup {
  doctorName: string;
  booked: number;
  attendance: number;
  completed: number;
  canceled: number;
  bookings: AllBookings[];
}
