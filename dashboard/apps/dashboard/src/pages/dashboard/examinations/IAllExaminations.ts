export interface AllExaminations {
  doctorId: string;
  patientId: string;
  doctorFirstName: string;
  doctorLastName: string;
  createdAt: string;
}
export interface DoctorGroup {
  doctorId: string;
  doctorName: string;
  count: number;
  documents: AllExaminations[];
}
