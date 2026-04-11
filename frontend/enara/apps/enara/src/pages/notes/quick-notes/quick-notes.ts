import {
  Component,
  inject,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { apiUrl } from '../../../constants/constants';
import { HttpClient } from '@angular/common/http';
import {
  Appointment,
  ChildSessionSecondary,
  GroupSessionSecondary,
  IndividualSessionSecondary,
  QuickNotesParams,
  ReportInfoParams,
  RequestInfo,
} from './IReport';
import { AuthService } from '../../../../src/sevices/auth-db';
import { Translation } from '../../../../src/sevices/translation';


@Component({
  selector: 'app-quick-notes',
  standalone: true,
  imports: [
    MatExpansionModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './quick-notes.html',
  styleUrl: './quick-notes.css',
})
export default class QuickNotes implements OnChanges {
  private http = inject(HttpClient);
  translate = inject(Translation);

  fileInfo = signal<RequestInfo | null>(null);
  readonly panelOpenState = signal(false);
  appointment = signal<Appointment | null>(null);
  private auth = inject(AuthService);
  @Input() statusBackgroundAndDiagnosis!: boolean;
  @Input() examinationHistory!: boolean;
  @Input() patientSummary!: boolean;
  @Input() requestId!: string;
  @Input() patientId!: string;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestId'] && this.requestId) {
      this.loadPatientFile();
    }
  }

  loadPatientFile() {
    const getRequestlink = `${apiUrl}/request/info/${this.requestId}`;

    this.http
      .get(getRequestlink, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.fileInfo.set(res.token);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  
  computedFirstName = () => this.fileInfo()?.firstName ?? '-';
  computedLastName = () => this.fileInfo()?.lastName ?? '-';
  computedAge = () => this.fileInfo()?.age ?? '-';
  computedPatientPhoneNumber= ()=> this.fileInfo()?.patientPhoneNumber ?? "-";
  
  @Output() sendQuickNotes = new EventEmitter<QuickNotesParams>();
  @Output() sendReportInfo = new EventEmitter<ReportInfoParams>();

  mod = '';
  sleep = '';
  appetite = '';
  suicide = '';
  get isQuickNotesDisabled(): boolean {
    return this.statusBackgroundAndDiagnosis || this.examinationHistory || this.patientSummary;
  }

  get isQuickNotesExpanded(): boolean {
    return !this.statusBackgroundAndDiagnosis && !this.examinationHistory && !this.patientSummary;
  }
  onModChanged(value: string) {
    this.mod = value;
    this.emit();
  }
  onSleepChanged(value: string) {
    this.sleep = value;
    this.emit();
  }
  onAppetiteChanged(value: string) {
    this.appetite = value;
    this.emit();
  }
  onSuicideChanged(value: string) {
    this.suicide = value;
    this.emit();
  }
  private emit() {
    this.sendQuickNotes.emit({
      mod: this.mod,
      sleep: this.sleep,
      appetite: this.appetite,
      suicide: this.suicide,
    });
    this.sendReportInfo.emit({
      reportInfo: this.appointment() ? this.appointment()!.reportInfo : null,
      meetingType: this.appointment()?.meetingType ?? "-",
    })
  
    
  }
  
  async ngOnInit() {
    if (!this.patientId) {
      console.error('❌ patientId is missing');
      return;
    }

    const token = await this.auth.getToken();
    if (!token) {
      console.error('❌ Token not found');
      return;
    }

    const url = `${apiUrl}/booking/report-info/${this.patientId}`;

    this.http
      .get<any>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res) => {
          const nearest = this.getNearestAppointment(res.token);
          this.appointment.set(nearest);
        },
        error: (err) => console.error('❌ API error', err),
      });
  }
  private getNearestAppointment(
    appointments: Appointment[],
  ): Appointment | null {
    if (!appointments?.length) return null;

    const now = new Date();

    const sorted = appointments
      .map((a) => ({
        ...a,
        _dateTime: new Date(`${a.appointmentDate} ${a.appointmentTime}`),
      }))
      .filter((a) => a._dateTime >= now)
      .sort((a, b) => a._dateTime.getTime() - b._dateTime.getTime());

    return sorted[0] ?? null;
  }

  
  isIndividualSession() {
    return this.appointment()?.meetingType === 'individualSession';
  }

  isCouplesSession() {
    return this.appointment()?.meetingType === 'couplesSession';
  }

  isChildrenSession() {
    return this.appointment()?.meetingType === 'childrensSession';
  }

  isTeenagersSession() {
    return this.appointment()?.meetingType === 'teenagersSession';
  }

  
  get individualReport(): IndividualSessionSecondary | null {
    return this.isIndividualSession()
      ? (this.appointment()?.reportInfo as IndividualSessionSecondary)
      : null;
  }

  get groupReport(): GroupSessionSecondary | null {
    return this.isCouplesSession()
      ? (this.appointment()?.reportInfo as GroupSessionSecondary)
      : null;
  }

  get childReport(): ChildSessionSecondary | null {
    return this.isChildrenSession() || this.isTeenagersSession()
      ? (this.appointment()?.reportInfo as ChildSessionSecondary)
      : null;
  }
getMeetingTypeLabel(): string {
  const map: Record<string, string> = {
    individualSession: this.translate.t('quick-notes-details.meetingType.individualSession'),
    couplesSession: this.translate.t('quick-notes-details.meetingType.couplesSession'),
    childrensSession: this.translate.t('quick-notes-details.meetingType.childrensSession'),
    teenagersSession: this.translate.t('quick-notes-details.meetingType.teenagersSession'),
  };
  return map[this.appointment()?.meetingType || ''] || '';
}

getSupportLabel(value?: string): string {
  const map: Record<string, string> = {
    haveSupportivePerson: this.translate.t('quick-notes-details.support.haveSupportivePerson'),
    feelLonely: this.translate.t('quick-notes-details.support.feelLonely'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.support.default');
}

getPressureLabel(value?: string): string {
  const map: Record<string, string> = {
    low: this.translate.t('quick-notes-details.pressure.low'),
    medium: this.translate.t('quick-notes-details.pressure.medium'),
    high: this.translate.t('quick-notes-details.pressure.high'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.pressure.default');
}

getPsychologicalSafetyLabel(value?: string): string {
  const map: Record<string, string> = {
    harmfulThoughts: this.translate.t('quick-notes-details.psychologicalSafety.harmfulThoughts'),
    noHarmfulThoughts: this.translate.t('quick-notes-details.psychologicalSafety.noHarmfulThoughts'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.psychologicalSafety.default');
}

getAdviceLabels(values?: string[]): string[] {
  const map: Record<string, string> = {
    anxiety: this.translate.t('quick-notes-details.advice.anxiety'),
    depression: this.translate.t('quick-notes-details.advice.depression'),
    psychologicalPressure: this.translate.t('quick-notes-details.advice.psychologicalPressure'),
    relationshipProblems: this.translate.t('quick-notes-details.advice.relationshipProblems'),
    shock: this.translate.t('quick-notes-details.advice.shock'),
    anotherReason: this.translate.t('quick-notes-details.advice.anotherReason'),
  };
  return values?.map((v) => map[v] || v) ?? [];
}

getFeelingLabels(values?: string[]): string[] {
  const map: Record<string, string> = {
    difficultySleeping: this.translate.t('quick-notes-details.feeling.difficultySleeping'),
    overwork: this.translate.t('quick-notes-details.feeling.overwork'),
    poorConcentration: this.translate.t('quick-notes-details.feeling.poorConcentration'),
    moodSwings: this.translate.t('quick-notes-details.feeling.moodSwings'),
    panicAttacks: this.translate.t('quick-notes-details.feeling.panicAttacks'),
    noneAbove: this.translate.t('quick-notes-details.feeling.noneAbove'),
  };
  return values?.map((v) => map[v] || v) ?? [];
}

getGroupCountLabel(value?: string): string {
  const map: Record<string, string> = {
    two: this.translate.t('quick-notes-details.groupCount.two'),
    three: this.translate.t('quick-notes-details.groupCount.three'),
    four: this.translate.t('quick-notes-details.groupCount.four'),
    more: this.translate.t('quick-notes-details.groupCount.more'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.groupCount.default');
}

getWhoJoinedLabel(value?: string): string {
  const map: Record<string, string> = {
    couple: this.translate.t('quick-notes-details.whoJoined.couple'),
    parentsChildren: this.translate.t('quick-notes-details.whoJoined.parentsChildren'),
    extendedFamily: this.translate.t('quick-notes-details.whoJoined.extendedFamily'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.whoJoined.default');
}

getGroupReasonLabel(value?: string): string {
  const map: Record<string, string> = {
    maritalDisputes: this.translate.t('quick-notes-details.groupReason.maritalDisputes'),
    communicationProblems: this.translate.t('quick-notes-details.groupReason.communicationProblems'),
    difficultiesWithChildren: this.translate.t('quick-notes-details.groupReason.difficultiesWithChildren'),
    lifePressures: this.translate.t('quick-notes-details.groupReason.lifePressures'),
    separationOrDivorce: this.translate.t('quick-notes-details.groupReason.separationOrDivorce'),
    recentPressureEvent: this.translate.t('quick-notes-details.groupReason.recentPressureEvent'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.groupReason.default');
}

getWhatHappeningFamilyLabel(value?: string): string {
  const map: Record<string, string> = {
    frequentConflicts: this.translate.t('quick-notes-details.whatHappeningFamily.frequentConflicts'),
    constantTension: this.translate.t('quick-notes-details.whatHappeningFamily.constantTension'),
    difficultyExpressingFeelings: this.translate.t('quick-notes-details.whatHappeningFamily.difficultyExpressingFeelings'),
    avoidDialogue: this.translate.t('quick-notes-details.whatHappeningFamily.avoidDialogue'),
    supportAndCooperation: this.translate.t('quick-notes-details.whatHappeningFamily.supportAndCooperation'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.whatHappeningFamily.default');
}

getPurposeSessionsLabel(value?: string): string {
  const map: Record<string, string> = {
    improvingCommunication: this.translate.t('quick-notes-details.purposeSessions.improvingCommunication'),
    reducingDisagreements: this.translate.t('quick-notes-details.purposeSessions.reducingDisagreements'),
    supportingFamilyMember: this.translate.t('quick-notes-details.purposeSessions.supportingFamilyMember'),
    understandingRelationship: this.translate.t('quick-notes-details.purposeSessions.understandingRelationship'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.purposeSessions.default');
}

getChildAgeLabel(value?: string): string {
  const map: Record<string, string> = {
    '4between8': this.translate.t('quick-notes-details.childAge.4between8'),
    '9between14': this.translate.t('quick-notes-details.childAge.9between14'),
    '15between18': this.translate.t('quick-notes-details.childAge.15between18'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.childAge.default');
}

getReasonForAssistanceLabel(value?: string): string {
  const map: Record<string, string> = {
    anxietyConcerns: this.translate.t('quick-notes-details.reasonForAssistance.anxietyConcerns'),
    angerFits: this.translate.t('quick-notes-details.reasonForAssistance.angerFits'),
    distractibilityHyperactivity: this.translate.t('quick-notes-details.reasonForAssistance.distractibilityHyperactivity'),
    socialWithdrawal: this.translate.t('quick-notes-details.reasonForAssistance.socialWithdrawal'),
    behavioralProblems: this.translate.t('quick-notes-details.reasonForAssistance.behavioralProblems'),
    learningDifficulties: this.translate.t('quick-notes-details.reasonForAssistance.learningDifficulties'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.reasonForAssistance.default');
}

getBehaviorLabels(values?: string[]): string[] {
  const map: Record<string, string> = {
    moodSwings: this.translate.t('quick-notes-details.behavior.moodSwings'),
    frequentCrying: this.translate.t('quick-notes-details.behavior.frequentCrying'),
    aggression: this.translate.t('quick-notes-details.behavior.aggression'),
    excessiveAttachment: this.translate.t('quick-notes-details.behavior.excessiveAttachment'),
    sleepProblems: this.translate.t('quick-notes-details.behavior.sleepProblems'),
  };
  return values?.map((v) => map[v] || v) ?? [];
}

getSchoolLabels(value?: string): string {
  const map: Record<string, string> = {
    academicDecline: this.translate.t('quick-notes-details.school.academicDecline'),
    schoolComplaints: this.translate.t('quick-notes-details.school.schoolComplaints'),
    difficultyFriendships: this.translate.t('quick-notes-details.school.difficultyFriendships'),
    noProblems: this.translate.t('quick-notes-details.school.noProblems'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.school.default');
}

getChildSafetyLabel(value?: string): string {
  const map: Record<string, string> = {
    PsychologicalDistress: this.translate.t('quick-notes-details.childSafety.PsychologicalDistress'),
    selfHarmfulThoughts: this.translate.t('quick-notes-details.childSafety.selfHarmfulThoughts'),
    nothingWorry: this.translate.t('quick-notes-details.childSafety.nothingWorry'),
  };
  return map[value || ''] || this.translate.t('quick-notes-details.childSafety.default');
}
}
