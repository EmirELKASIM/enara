export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date | null;
  gender: string;
  maritalStatus: string;
  accountType: string;
  consultation:string;
  phoneNumber:string;
}

export interface SummaryInfo{
  id:string;
  psychologicalSummary:string;
}

export interface ExperienceInfo{
  id:string;
  experienceSummary:string;
  experienceDesc:string;
  certificates:string;
  language:string;
}

export interface optionsData {
  gender: string;
  maritalStatus: string;
  consultation: string;
}

export type PhoneNumber = {
  number: string;
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
};