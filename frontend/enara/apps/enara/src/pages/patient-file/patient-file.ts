import { Component, inject, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { apiUrl } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../sevices/auth-db';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {
  Appointment,
  ChildSessionSecondary,
  ComplaintPreview,
  GroupSessionSecondary,
  IndividualSessionSecondary,
  UserInfo,
} from './Interfaces';
import { MatDialog } from '@angular/material/dialog';
import DialogDeletePanel from './dialog-delete-panel/dialog-delete-panel';
import { Translation } from '../../sevices/translation';

@Component({
  selector: 'app-patient-file',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
  ],
  templateUrl: './patient-file.html',
  styleUrl: './patient-file.css',
})
export default class PatientFile {
  data = signal<ComplaintPreview[]>([]);
  info = signal<UserInfo | null>(null);
  userId!: string;
  @Input() patientId!: string;
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);

  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  formatDate(createdAt: string): string {
    const lang = this.translate.currentLang(); // أو lang() حسب خدمتك
    return new Date(createdAt).toLocaleDateString(lang);
  }

  formatTime(createdAt: string): string {
    const lang = this.translate.currentLang();
    return new Date(createdAt).toLocaleTimeString(lang);
  }

  formatDay(createdAt: string): string {
    const lang = this.translate.currentLang();
    return new Date(createdAt).toLocaleDateString(lang, {
      weekday: 'long',
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadData();
    });
  }

  async loadData() {
    const token = await this.auth.getToken();
    if (!token) return;

    const url = `${apiUrl}/examination/user-info`;

    this.http
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.data.set(res.token);
        },
        error: console.error,
      });
  }

  onDeletePanel(examinationId: string, patientId: string, doctorId: string) {
    const dialogRef = this.dialog.open(DialogDeletePanel, {
      panelClass: 'delete-panel-dialog',
      data: {
        examinationId: examinationId,
        patientId: patientId,
        doctorId: doctorId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.removeFromUI(examinationId);
      }
    });
  }
  removeFromUI(examinationId: string) {
    this.data.update((items) =>
      items.filter((item) => item._id !== examinationId),
    );
  }

  addNewNote() {
    this.router.navigate(['booking']);
  }

  isIndividualSession(item: ComplaintPreview): boolean {
    return item.meetingType === 'individualSession';
  }

  isGroupSession(item: ComplaintPreview): boolean {
    return item.meetingType === 'couplesSession';
  }

  isChildSession(item: ComplaintPreview): boolean {
    return (
      item.meetingType === 'childrensSession' ||
      item.meetingType === 'teenagersSession'
    );
  }

  /* ================= Typed Reports (مثل QuickNotes) ================= */

  getIndividualReport(
    item: ComplaintPreview,
  ): IndividualSessionSecondary | null {
    return this.isIndividualSession(item)
      ? (item.reportInfo as IndividualSessionSecondary)
      : null;
  }

  getGroupReport(item: ComplaintPreview): GroupSessionSecondary | null {
    return this.isGroupSession(item)
      ? (item.reportInfo as GroupSessionSecondary)
      : null;
  }

  getChildReport(item: ComplaintPreview): ChildSessionSecondary | null {
    return this.isChildSession(item)
      ? (item.reportInfo as ChildSessionSecondary)
      : null;
  }
  getSupportLabel(value?: string): string {
    const map: Record<string, string> = {
      haveSupportivePerson: this.translate.t(
        'patient-file-details.haveSupportivePerson',
      ),
      feelLonely: this.translate.t('patient-file-details.feelLonely'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getPressureLabel(value?: string): string {
    const map: Record<string, string> = {
      low: this.translate.t('patient-file-details.pressureLow'),
      medium: this.translate.t('patient-file-details.pressureMedium'),
      high: this.translate.t('patient-file-details.pressureHigh'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getPsychologicalSafetyLabel(value?: string): string {
    const map: Record<string, string> = {
      harmfulThoughts: this.translate.t('patient-file-details.harmfulThoughts'),
      noHarmfulThoughts: this.translate.t(
        'patient-file-details.noHarmfulThoughts',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getAdviceLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      anxiety: this.translate.t('patient-file-details.adviceAnxiety'),
      depression: this.translate.t('patient-file-details.adviceDepression'),
      psychologicalPressure: this.translate.t(
        'patient-file-details.advicePsychologicalPressure',
      ),
      relationshipProblems: this.translate.t(
        'patient-file-details.adviceRelationshipProblems',
      ),
      shock: this.translate.t('patient-file-details.adviceShock'),
      anotherReason: this.translate.t(
        'patient-file-details.adviceAnotherReason',
      ),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  getFeelingLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      difficultySleeping: this.translate.t(
        'patient-file-details.feelingDifficultySleeping',
      ),
      overwork: this.translate.t('patient-file-details.feelingOverwork'),
      poorConcentration: this.translate.t(
        'patient-file-details.feelingPoorConcentration',
      ),
      moodSwings: this.translate.t('patient-file-details.feelingMoodSwings'),
      panicAttacks: this.translate.t(
        'patient-file-details.feelingPanicAttacks',
      ),
      noneAbove: this.translate.t('patient-file-details.feelingNoneAbove'),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  /* ================= Couples Labels ================= */
  getGroupCountLabel(value?: string): string {
    const map: Record<string, string> = {
      two: this.translate.t('patient-file-details.groupCountTwo'),
      three: this.translate.t('patient-file-details.groupCountThree'),
      four: this.translate.t('patient-file-details.groupCountFour'),
      more: this.translate.t('patient-file-details.groupCountMore'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getWhoJoinedLabel(value?: string): string {
    const map: Record<string, string> = {
      couple: this.translate.t('patient-file-details.whoJoinedCouple'),
      parentsChildren: this.translate.t(
        'patient-file-details.whoJoinedParentsChildren',
      ),
      extendedFamily: this.translate.t(
        'patient-file-details.whoJoinedExtendedFamily',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getGroupReasonLabel(value?: string): string {
    const map: Record<string, string> = {
      maritalDisputes: this.translate.t(
        'patient-file-details.groupReasonMaritalDisputes',
      ),
      communicationProblems: this.translate.t(
        'patient-file-details.groupReasonCommunicationProblems',
      ),
      difficultiesWithChildren: this.translate.t(
        'patient-file-details.groupReasonDifficultiesWithChildren',
      ),
      lifePressures: this.translate.t(
        'patient-file-details.groupReasonLifePressures',
      ),
      separationOrDivorce: this.translate.t(
        'patient-file-details.groupReasonSeparationOrDivorce',
      ),
      recentPressureEvent: this.translate.t(
        'patient-file-details.groupReasonRecentPressureEvent',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getWhatHappeningFamilyLabel(value?: string): string {
    const map: Record<string, string> = {
      frequentConflicts: this.translate.t(
        'patient-file-details.familyHappeningFrequentConflicts',
      ),
      constantTension: this.translate.t(
        'patient-file-details.familyHappeningConstantTension',
      ),
      difficultyExpressingFeelings: this.translate.t(
        'patient-file-details.familyHappeningDifficultyExpressingFeelings',
      ),
      avoidDialogue: this.translate.t(
        'patient-file-details.familyHappeningAvoidDialogue',
      ),
      supportAndCooperation: this.translate.t(
        'patient-file-details.familyHappeningSupportAndCooperation',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getPurposeSessionsLabel(value?: string): string {
    const map: Record<string, string> = {
      improvingCommunication: this.translate.t(
        'patient-file-details.purposeImprovingCommunication',
      ),
      reducingDisagreements: this.translate.t(
        'patient-file-details.purposeReducingDisagreements',
      ),
      supportingFamilyMember: this.translate.t(
        'patient-file-details.purposeSupportingFamilyMember',
      ),
      understandingRelationship: this.translate.t(
        'patient-file-details.purposeUnderstandingRelationship',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  /* ================= Children / Teen Labels ================= */
  getChildAgeLabel(value?: string): string {
    const map: Record<string, string> = {
      '4between8': this.translate.t('patient-file-details.childAge4to8'),
      '9between14': this.translate.t('patient-file-details.childAge9to14'),
      '15between18': this.translate.t('patient-file-details.childAge15to18'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getReasonForAssistanceLabel(value?: string): string {
    const map: Record<string, string> = {
      anxietyConcerns: this.translate.t(
        'patient-file-details.reasonAnxietyConcerns',
      ),
      angerFits: this.translate.t('patient-file-details.reasonAngerFits'),
      distractibilityHyperactivity: this.translate.t(
        'patient-file-details.reasonDistractibilityHyperactivity',
      ),
      socialWithdrawal: this.translate.t(
        'patient-file-details.reasonSocialWithdrawal',
      ),
      behavioralProblems: this.translate.t(
        'patient-file-details.reasonBehavioralProblems',
      ),
      learningDifficulties: this.translate.t(
        'patient-file-details.reasonLearningDifficulties',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getBehaviorLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      moodSwings: this.translate.t('patient-file-details.behaviorMoodSwings'),
      frequentCrying: this.translate.t(
        'patient-file-details.behaviorFrequentCrying',
      ),
      aggression: this.translate.t('patient-file-details.behaviorAggression'),
      excessiveAttachment: this.translate.t(
        'patient-file-details.behaviorExcessiveAttachment',
      ),
      sleepProblems: this.translate.t(
        'patient-file-details.behaviorSleepProblems',
      ),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  getSchoolLabels(value?: string): string {
    const map: Record<string, string> = {
      academicDecline: this.translate.t(
        'patient-file-details.schoolAcademicDecline',
      ),
      schoolComplaints: this.translate.t(
        'patient-file-details.schoolComplaints',
      ),
      difficultyFriendships: this.translate.t(
        'patient-file-details.schoolDifficultyFriendships',
      ),
      noProblems: this.translate.t('patient-file-details.schoolNoProblems'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getChildSafetyLabel(value?: string): string {
    const map: Record<string, string> = {
      PsychologicalDistress: this.translate.t(
        'patient-file-details.childSafetyPsychologicalDistress',
      ),
      selfHarmfulThoughts: this.translate.t(
        'patient-file-details.childSafetySelfHarmfulThoughts',
      ),
      nothingWorry: this.translate.t(
        'patient-file-details.childSafetyNothingWorry',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getComplaintDurationLabel(value?: string): string {
    const map: Record<string, string> = {
      days: this.translate.t('patient-file-details.complaintDurationDays'),
      weeks: this.translate.t('patient-file-details.complaintDurationWeeks'),
      months: this.translate.t('patient-file-details.complaintDurationMonths'),
      years: this.translate.t('patient-file-details.complaintDurationYears'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getComplaintSeverityLabel(value?: string): string {
    const map: Record<string, string> = {
      mild: this.translate.t('patient-file-details.complaintSeverityMild'),
      moderate: this.translate.t(
        'patient-file-details.complaintSeverityModerate',
      ),
      severe: this.translate.t('patient-file-details.complaintSeveritySevere'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getModLabel(value?: string): string {
    const map: Record<string, string> = {
      anxiety: this.translate.t('patient-file-details.modAnxiety'),
      volatile: this.translate.t('patient-file-details.modVolatile'),
      stable: this.translate.t('patient-file-details.modStable'),
      depressed: this.translate.t('patient-file-details.modDepressed'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getSleepLabel(value?: string): string {
    const map: Record<string, string> = {
      bad: this.translate.t('patient-file-details.sleepBad'),
      middle: this.translate.t('patient-file-details.sleepMiddle'),
      good: this.translate.t('patient-file-details.sleepGood'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getAppetiteLabel(value?: string): string {
    const map: Record<string, string> = {
      natural: this.translate.t('patient-file-details.appetiteNatural'),
      low: this.translate.t('patient-file-details.appetiteLow'),
      high: this.translate.t('patient-file-details.appetiteHigh'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getSuicideLabel(value?: string): string {
    const map: Record<string, string> = {
      yes: this.translate.t('patient-file-details.suicideYes'),
      no: this.translate.t('patient-file-details.suicideNo'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getDrankMedicinesLabel(value?: string): string {
    const map: Record<string, string> = {
      beforefood: this.translate.t(
        'patient-file-details.drankMedicinesBeforeFood',
      ),
      afterfood: this.translate.t(
        'patient-file-details.drankMedicinesAfterFood',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }

  getDrugTimesLabel(value?: string): string {
    const map: Record<string, string> = {
      breakfast: this.translate.t('patient-file-details.drugTimesBreakfast'),
      lunch: this.translate.t('patient-file-details.drugTimesLunch'),
      dinner: this.translate.t('patient-file-details.drugTimesDinner'),
    };
    return (
      map[value || ''] ||
      this.translate.t('patient-file-details.undefinedLabel')
    );
  }
}
