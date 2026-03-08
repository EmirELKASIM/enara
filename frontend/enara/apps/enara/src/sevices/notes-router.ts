import { Injectable } from '@angular/core';
export type ProfileView = 'complaintAndTreatment' | 'statusBackgroundAndDiagnosis' | 'patientSummary' | 'examinationHistory';

@Injectable({
  providedIn: 'root',
})
export class NotesRouter {
  public currentView: ProfileView = 'complaintAndTreatment';

  router(view: ProfileView) {
    this.currentView = view;
  }

  isComplaintAndTreatment() {
    return this.currentView === 'complaintAndTreatment';
  }
  isStatusBackgroundAndDiagnosis() {
    return this.currentView === 'statusBackgroundAndDiagnosis';
  }
  isExaminationHistory() {
    return this.currentView === 'examinationHistory';
  }
  isPatientSummary() {
    return this.currentView === 'patientSummary';
  }

}
