export interface timesParams {
  time: string;
  status: string;
}
export interface GetAppointmentParams {
  _id: string;
  day: string;
  date: string;
  times: timesParams[];
}
