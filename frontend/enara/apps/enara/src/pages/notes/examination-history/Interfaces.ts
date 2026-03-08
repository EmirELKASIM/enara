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
    }
  | {
      meetingType: 'couplesSession';

      reportInfo?: GroupSessionSecondary;
    }
  | {
      meetingType: 'childrensSession';

      reportInfo?: ChildSessionSecondary;
    }
  | {
      meetingType: 'teenagersSession';

      reportInfo?: ChildSessionSecondary;
    };

export interface QuickNotes {
  mod: string;
  sleep: string;
  appetite: string;
  suicide: string;
}

export interface Medicine {
  drugName: string;
  doz: string;
  intakeNotes: string;
  drankMedicinesBefore: string;
  drugTimes: string[];
  _id: string;
}

export interface ComplaintPreviewBase {
  _id: string;
  patientId: string;
  doctorId: string;
  complaint: string;
  complaintDuration: string;
  complaintSeverity: string;
  quickNotes: QuickNotes;
  medicines: Medicine[];
  reportInfo: Appointment;
  meetingType: string;
  createdAt: string;
}

export type ComplaintPreview =
  | (ComplaintPreviewBase & {
      meetingType: 'individualSession';
      reportInfo: IndividualSessionSecondary;
    })
  | (ComplaintPreviewBase & {
      meetingType: 'couplesSession';
      reportInfo: GroupSessionSecondary;
    })
  | (ComplaintPreviewBase & {
      meetingType: 'childrensSession' | 'teenagersSession';
      reportInfo: ChildSessionSecondary;
    });
