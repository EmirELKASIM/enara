export interface IndividualSessionSecondary {
  support?: string;
  pressure?: string;
  psychologicalSafety?: string;
  whySeekingAdvice?: string[];
  howFeelingLately?: string[];
}

export interface GroupSessionSecondary {
  numberIndividuals?: string;
  whoParticipating?: string;
  reasonForConsultation?: string;
  whatHappeningFamily?: string;
  purposeSessions?: string;
}

export interface ChildSessionSecondary {
  childAge?: string;
  school?: string;
  psychologicalSafetyForChild: string;
  behaviorAndFeelings?: string[];
  reasonForAssistance?: string;
}

export type Appointment =
  | {
      meetingType: 'individualSession';

      reportInfo?: IndividualSessionSecondary;

      _id: string;
      userId: string;
      doctorId: string;
      appointmentId: string;

      firstName: string;
      lastName: string;

      doctorFirstName: string;
      doctorLastName: string;
      doctorAccountType: string;

      appointmentDate: string;
      appointmentDay: string;
      appointmentTime: string;
      appointmentDateTime: Date;

      deletedFromUser: boolean;
      deletedFromDoctor: boolean;
      isActive: boolean;
      onChange: boolean;

      meetingUrl: string;
      changeDetails: string;

      status: 'booked' | 'completed' | 'cancelled';

      createdAt: Date;
      updatedAt: Date;
    }
  | {
      meetingType: 'couplesSession';

      reportInfo?: GroupSessionSecondary;

      _id: string;
      userId: string;
      doctorId: string;
      appointmentId: string;

      firstName: string;
      lastName: string;

      doctorFirstName: string;
      doctorLastName: string;
      doctorAccountType: string;

      appointmentDate: string;
      appointmentDay: string;
      appointmentTime: string;
      appointmentDateTime: Date;

      deletedFromUser: boolean;
      deletedFromDoctor: boolean;
      isActive: boolean;
      onChange: boolean;

      meetingUrl: string;
      changeDetails: string;

      status: 'booked' | 'completed' | 'cancelled';

      createdAt: Date;
      updatedAt: Date;
    }
  | {
      meetingType: 'childrensSession';

      reportInfo?: ChildSessionSecondary;

      _id: string;
      userId: string;
      doctorId: string;
      appointmentId: string;

      firstName: string;
      lastName: string;

      doctorFirstName: string;
      doctorLastName: string;
      doctorAccountType: string;

      appointmentDate: string;
      appointmentDay: string;
      appointmentTime: string;
      appointmentDateTime: Date;

      deletedFromUser: boolean;
      deletedFromDoctor: boolean;
      isActive: boolean;
      onChange: boolean;

      meetingUrl: string;
      changeDetails: string;

      status: 'booked' | 'completed' | 'cancelled';

      createdAt: Date;
      updatedAt: Date;
    }
  | {
      meetingType: 'teenagersSession';

      reportInfo?: ChildSessionSecondary;

      _id: string;
      userId: string;
      doctorId: string;
      appointmentId: string;

      firstName: string;
      lastName: string;

      doctorFirstName: string;
      doctorLastName: string;
      doctorAccountType: string;

      appointmentDate: string;
      appointmentDay: string;
      appointmentTime: string;
      appointmentDateTime: Date;

      deletedFromUser: boolean;
      deletedFromDoctor: boolean;
      isActive: boolean;
      onChange: boolean;

      meetingUrl: string;
      changeDetails: string;

      status: 'booked' | 'completed' | 'cancelled';

      createdAt: Date;
      updatedAt: Date;
    };

export interface RequestInfo {
  _id: string;
  firstName: string;
  lastName: string;
  age: string;
  patientPhoneNumber: string;
  doctorPhoneNumber: string;
}

export interface QuickNotesParams {
  mod: string;
  sleep: string;
  appetite: string;
  suicide: string;
}
export interface ReportInfoParams {
  reportInfo: any;
  meetingType: string;
}
