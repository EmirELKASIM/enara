import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { apiUrl } from '../../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../sevices/auth-db';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  ChildSessionSecondary,
  ComplaintPreview,
  GroupSessionSecondary,
  IndividualSessionSecondary,
} from './Interfaces';
import { MatDialog } from '@angular/material/dialog';
import DialogDeletePanel from './dialog-delete-panel/dialog-delete-panel';
import { Translation } from '../../../../src/sevices/translation';

@Component({
  selector: 'app-examination-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
  ],
  templateUrl: './examination-history.html',
  styleUrl: './examination-history.css',
})
export default class ExaminationHistory implements OnInit {
  data = signal<ComplaintPreview[]>([]);
  @Input() patientId!: string;
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  formatDate(createdAt: string): string {
    const lang = this.translate.currentLang(); 
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
    if (!this.patientId) return;

    const token = await this.auth.getToken();
    if (!token) return;

    const url = `${apiUrl}/examination/info/${this.patientId}`;

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
        'examination-history-details.haveSupportivePerson',
      ),
      feelLonely: this.translate.t('examination-history-details.feelLonely'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getPressureLabel(value?: string): string {
    const map: Record<string, string> = {
      low: this.translate.t('examination-history-details.low'),
      medium: this.translate.t('examination-history-details.medium'),
      high: this.translate.t('examination-history-details.high'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getPsychologicalSafetyLabel(value?: string): string {
    const map: Record<string, string> = {
      harmfulThoughts: this.translate.t(
        'examination-history-details.harmfulThoughts',
      ),
      noHarmfulThoughts: this.translate.t(
        'examination-history-details.noHarmfulThoughts',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getAdviceLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      anxiety: this.translate.t('examination-history-details.anxiety'),
      depression: this.translate.t('examination-history-details.depression'),
      psychologicalPressure: this.translate.t(
        'examination-history-details.psychologicalPressure',
      ),
      relationshipProblems: this.translate.t(
        'examination-history-details.relationshipProblems',
      ),
      shock: this.translate.t('examination-history-details.shock'),
      anotherReason: this.translate.t(
        'examination-history-details.anotherReason',
      ),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  getFeelingLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      difficultySleeping: this.translate.t(
        'examination-history-details.difficultySleeping',
      ),
      overwork: this.translate.t('examination-history-details.overwork'),
      poorConcentration: this.translate.t(
        'examination-history-details.poorConcentration',
      ),
      moodSwings: this.translate.t('examination-history-details.moodSwings'),
      panicAttacks: this.translate.t(
        'examination-history-details.panicAttacks',
      ),
      noneAbove: this.translate.t('examination-history-details.noneAbove'),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  getGroupCountLabel(value?: string): string {
    const map: Record<string, string> = {
      two: this.translate.t('examination-history-details.two'),
      three: this.translate.t('examination-history-details.three'),
      four: this.translate.t('examination-history-details.four'),
      more: this.translate.t('examination-history-details.more'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getWhoJoinedLabel(value?: string): string {
    const map: Record<string, string> = {
      couple: this.translate.t('examination-history-details.couple'),
      parentsChildren: this.translate.t(
        'examination-history-details.parentsChildren',
      ),
      extendedFamily: this.translate.t(
        'examination-history-details.extendedFamily',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getGroupReasonLabel(value?: string): string {
    const map: Record<string, string> = {
      maritalDisputes: this.translate.t(
        'examination-history-details.maritalDisputes',
      ),
      communicationProblems: this.translate.t(
        'examination-history-details.communicationProblems',
      ),
      difficultiesWithChildren: this.translate.t(
        'examination-history-details.difficultiesWithChildren',
      ),
      lifePressures: this.translate.t(
        'examination-history-details.lifePressures',
      ),
      separationOrDivorce: this.translate.t(
        'examination-history-details.separationOrDivorce',
      ),
      recentPressureEvent: this.translate.t(
        'examination-history-details.recentPressureEvent',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getWhatHappeningFamilyLabel(value?: string): string {
    const map: Record<string, string> = {
      frequentConflicts: this.translate.t(
        'examination-history-details.frequentConflicts',
      ),
      constantTension: this.translate.t(
        'examination-history-details.constantTension',
      ),
      difficultyExpressingFeelings: this.translate.t(
        'examination-history-details.difficultyExpressingFeelings',
      ),
      avoidDialogue: this.translate.t(
        'examination-history-details.avoidDialogue',
      ),
      supportAndCooperation: this.translate.t(
        'examination-history-details.supportAndCooperation',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getPurposeSessionsLabel(value?: string): string {
    const map: Record<string, string> = {
      improvingCommunication: this.translate.t(
        'examination-history-details.improvingCommunication',
      ),
      reducingDisagreements: this.translate.t(
        'examination-history-details.reducingDisagreements',
      ),
      supportingFamilyMember: this.translate.t(
        'examination-history-details.supportingFamilyMember',
      ),
      understandingRelationship: this.translate.t(
        'examination-history-details.understandingRelationship',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getChildAgeLabel(value?: string): string {
    const map: Record<string, string> = {
      '4between8': this.translate.t('examination-history-details.childAge4to8'), 
      '9between14': this.translate.t(
        'examination-history-details.childAge9to14',
      ), 
      '15between18': this.translate.t(
        'examination-history-details.childAge15to18',
      ), 
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getReasonForAssistanceLabel(value?: string): string {
    const map: Record<string, string> = {
      anxietyConcerns: this.translate.t(
        'examination-history-details.anxietyConcerns',
      ),
      angerFits: this.translate.t('examination-history-details.angerFits'),
      distractibilityHyperactivity: this.translate.t(
        'examination-history-details.distractibilityHyperactivity',
      ),
      socialWithdrawal: this.translate.t(
        'examination-history-details.socialWithdrawal',
      ),
      behavioralProblems: this.translate.t(
        'examination-history-details.behavioralProblems',
      ),
      learningDifficulties: this.translate.t(
        'examination-history-details.learningDifficulties',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getBehaviorLabels(values?: string[]): string[] {
    const map: Record<string, string> = {
      moodSwings: this.translate.t('examination-history-details.moodSwings'), 
      frequentCrying: this.translate.t(
        'examination-history-details.frequentCrying',
      ),
      aggression: this.translate.t('examination-history-details.aggression'),
      excessiveAttachment: this.translate.t(
        'examination-history-details.excessiveAttachment',
      ),
      sleepProblems: this.translate.t(
        'examination-history-details.sleepProblems',
      ),
    };
    return values?.map((v) => map[v] || v) ?? [];
  }

  getSchoolLabels(value?: string): string {
    const map: Record<string, string> = {
      academicDecline: this.translate.t(
        'examination-history-details.academicDecline',
      ),
      schoolComplaints: this.translate.t(
        'examination-history-details.schoolComplaints',
      ),
      difficultyFriendships: this.translate.t(
        'examination-history-details.difficultyFriendships',
      ),
      noProblems: this.translate.t('examination-history-details.noProblems'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getChildSafetyLabel(value?: string): string {
    const map: Record<string, string> = {
      PsychologicalDistress: this.translate.t(
        'examination-history-details.psychologicalDistress',
      ), 
      selfHarmfulThoughts: this.translate.t(
        'examination-history-details.selfHarmfulThoughts',
      ),
      nothingWorry: this.translate.t(
        'examination-history-details.nothingWorry',
      ),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  
  getComplaintDurationLabel(value?: string): string {
    const map: Record<string, string> = {
      days: this.translate.t('examination-history-details.days'),
      weeks: this.translate.t('examination-history-details.weeks'),
      months: this.translate.t('examination-history-details.months'),
      years: this.translate.t('examination-history-details.years'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getComplaintSeverityLabel(value?: string): string {
    const map: Record<string, string> = {
      mild: this.translate.t('examination-history-details.mild'),
      moderate: this.translate.t('examination-history-details.moderate'),
      severe: this.translate.t('examination-history-details.severe'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }
  
  getModLabel(value?: string): string {
    const map: Record<string, string> = {
      anxiety: this.translate.t('examination-history-details.anxiety'), 
      volatile: this.translate.t('examination-history-details.volatile'),
      stable: this.translate.t('examination-history-details.stable'),
      depressed: this.translate.t('examination-history-details.depressed'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getSleepLabel(value?: string): string {
    const map: Record<string, string> = {
      bad: this.translate.t('examination-history-details.bad'),
      middle: this.translate.t('examination-history-details.moderate'), 
      good: this.translate.t('examination-history-details.good'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getAppetiteLabel(value?: string): string {
    const map: Record<string, string> = {
      natural: this.translate.t('examination-history-details.naturalAppetite'),
      low: this.translate.t('examination-history-details.lowAppetite'),
      high: this.translate.t('examination-history-details.highAppetite'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getSuicideLabel(value?: string): string {
    const map: Record<string, string> = {
      yes: this.translate.t('examination-history-details.yesSuicide'),
      no: this.translate.t('examination-history-details.noSuicide'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getDrankMedicinesLabel(value?: string): string {
    const map: Record<string, string> = {
      beforefood: this.translate.t('examination-history-details.beforeFood'),
      afterfood: this.translate.t('examination-history-details.afterFood'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }

  getDrugTimesLabel(value?: string): string {
    const map: Record<string, string> = {
      breakfast: this.translate.t('examination-history-details.breakfast'),
      lunch: this.translate.t('examination-history-details.lunch'),
      dinner: this.translate.t('examination-history-details.dinner'),
    };
    return (
      map[value || ''] ||
      this.translate.t('examination-history-details.notSpecified')
    );
  }
}
