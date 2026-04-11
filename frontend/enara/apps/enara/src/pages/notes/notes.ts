import {
  AfterViewChecked,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotesRouter } from '../../sevices/notes-router';
import MainComplaint from './main-complaint/main-complaint';
import QuickNotes from './quick-notes/quick-notes';
import StatusBackground from './status-background/status-background';
import Diagnosis from './diagnosis/diagnosis';
import TreatmentPlan from './treatment-plan/treatment-plan';
import { apiUrl } from '../../constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../sevices/auth-db';
import { ActivatedRoute } from '@angular/router';
import ExaminationHistory from './examination-history/examination-history';
import { Translation } from '../../sevices/translation';
import {
  BackgroundStatus,
  diagnosisInfo,
  DiagnosisParams,
  MainComplaintParams,
  Medicine,
  QuickNotesDetails,
  ReportInfo,
  TreatmentParams,
} from './INotesParams';
import PatientSummary from './patient-summary/patient-summary';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    MatIconModule,
    MainComplaint,
    QuickNotes,
    StatusBackground,
    Diagnosis,
    TreatmentPlan,
    HttpClientModule,
    ExaminationHistory,
    PatientSummary,
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export default class Notes implements OnInit,AfterViewChecked {
  fileInfo = signal<RequestInfo[]>([]);
  private addDiagnosisLink = `${apiUrl}/diagnosis/add`;
  private addExaminationLink = `${apiUrl}/examination/add`;
  private updateDiagnosisLink = `${apiUrl}/diagnosis/update`;
  translate = inject(Translation);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  diagnosisInfo = signal<diagnosisInfo | null>(null);
  requestId!: string;
  public patientId!: string;
  isDisabled = true;
  needTreatment = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
    public isTablet: boolean = this.screenWidth >= 600  && this.screenWidth <= 1200;


  backgroundStatus: BackgroundStatus = {
    clinicalHistory: '',
    sawDoctorBefore: '',
    sleepedAtHospital: '',
    drankMedicinesBefore: '',
  };
  diagnosis: DiagnosisParams = {
    diseaseName: '',
    diagnosesNotes: '',
    accompanyingDiagnoses: '',
    severityOfDisorder: '',
    durationOfDisorder: '',
    riskLevel: [],
  };
  treatment: TreatmentParams = {
    medicines: [],
  };
  mainComplaint: MainComplaintParams = {
    complaint: '',
    complaintDuration: '',
    complaintSeverity: '',
  };
  quickNotes: QuickNotesDetails = {
    mod: '',
    sleep: '',
    appetite: '',
    suicide: '',
  };
  reportInfo!: any;
  meetingType!: string;

  @ViewChild('scrollSection') section!: ElementRef;
  shouldScroll = false;
  onReportInfo(values: ReportInfo) {
    this.reportInfo = values.reportInfo;
    this.meetingType = values.meetingType;
  }
  public notesRouter = inject(NotesRouter);
  private route = inject(ActivatedRoute);
  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('requestId');
    const patientId = this.route.snapshot.paramMap.get('patientId');
    if (!requestId || !patientId) {
      this.toastr.warning(this.translate.t('toastr.no_id_found'));
      return;
    }
    this.requestId = requestId;
    this.patientId = patientId;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.section) {
      this.shouldScroll = false;

      // حساب موقع العنصر بالنسبة للصفحة
      const y =
        this.section.nativeElement.getBoundingClientRect().top + window.scrollY;

      // نحدد المسافة التي نريد إضافتها (مثلاً 100px)
      window.scrollTo({
        top: 800, // 100px أعلى من العنصر
        behavior: 'smooth',
      });
    }
  }
  onTreatmentChange(medicines: Medicine[]) {
    this.treatment.medicines = medicines;
  }
  onQuickNotesChange(notes: QuickNotesDetails) {
    this.quickNotes = notes;
  }
  onComplaintAndTreatment() {
    this.notesRouter.router('complaintAndTreatment');
  }
  onStatusBackgroundAndDiagnosis() {
    this.notesRouter.router('statusBackgroundAndDiagnosis');
    if (this.isMobile || this.isTablet) {
      this.shouldScroll = true;
    }
  }
  onExaminationHistory() {
    this.notesRouter.router('examinationHistory');
    if (this.isMobile || this.isTablet) {
      this.shouldScroll = true;
    }
  }
  onPatientSummary() {
    this.notesRouter.router('patientSummary');
    if (this.isMobile || this.isTablet) {
      this.shouldScroll = true;
    }
  }
  onNeedTreatment() {
    this.needTreatment = !this.needTreatment;
  }
  constructor() {
    effect(() => {
      if (!this.patientId) return;

      const diagnosisLink = `${apiUrl}/diagnosis/info/${this.patientId}`;

      this.auth.getToken().then((token) => {
        if (!token) return;

        this.http
          .get(diagnosisLink, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .subscribe({
            next: (res: any) => {
              this.diagnosisInfo.set(res.token);
            },
          });
      });
    });
  }
  computedId = computed(() => this.diagnosisInfo()?._id ?? '-');
  async onDiagnosisSave() {
    const hasDiagnosis = !!this.diagnosisInfo();
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const data = {
      patientId: this.patientId,
      clinicalHistory: this.backgroundStatus.clinicalHistory,
      sawDoctorBefore: this.backgroundStatus.sawDoctorBefore,
      sleepedAtHospital: this.backgroundStatus.sleepedAtHospital,
      drankMedicinesBefore: this.backgroundStatus.drankMedicinesBefore,
      diseaseName: this.diagnosis.diseaseName,
      diagnosesNotes: this.diagnosis.diagnosesNotes,
      accompanyingDiagnoses: this.diagnosis.accompanyingDiagnoses,
      severityOfDisorder: this.diagnosis.severityOfDisorder,
      durationOfDisorder: this.diagnosis.durationOfDisorder,
      riskLevel: this.diagnosis.riskLevel,
    };

    const dataForPut = {
      diagnosisId: this.computedId(),
      patientId: this.patientId,
      clinicalHistory: this.backgroundStatus.clinicalHistory,
      sawDoctorBefore: this.backgroundStatus.sawDoctorBefore,
      sleepedAtHospital: this.backgroundStatus.sleepedAtHospital,
      drankMedicinesBefore: this.backgroundStatus.drankMedicinesBefore,
      diseaseName: this.diagnosis.diseaseName,
      diagnosesNotes: this.diagnosis.diagnosesNotes,
      accompanyingDiagnoses: this.diagnosis.accompanyingDiagnoses,
      severityOfDisorder: this.diagnosis.severityOfDisorder,
      durationOfDisorder: this.diagnosis.durationOfDisorder,
      riskLevel: this.diagnosis.riskLevel,
    };

    if (!hasDiagnosis) {
      this.http
        .post(this.addDiagnosisLink, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res) => {
            this.toastr.success(this.translate.t('toastr.added_successfully'));
            this.isDisabled = true;
            window.location.reload();
          },
          error: (err) => {
            this.toastr.error(this.translate.t('toastr.something_went_wrong'));
          },
        });
    } else {
      this.http
        .put(this.updateDiagnosisLink, dataForPut, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res) => {
            this.toastr.success(
              this.translate.t('toastr.updated_successfully'),
            );
            this.isDisabled = true;
            window.location.reload();
          },
          error: (err) => {
            this.toastr.error(this.translate.t('toastr.something_went_wrong'));
          },
        });
    }
  }
  onDiagnosisCanceled() {
    this.isDisabled = !this.isDisabled;
  }
  async onComplaintSave() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const data = {
      patientId: this.patientId,
      medicines: this.treatment.medicines,
      complaint: this.mainComplaint.complaint,
      complaintDuration: this.mainComplaint.complaintDuration,
      complaintSeverity: this.mainComplaint.complaintSeverity,
      quickNotes: this.quickNotes,
      reportInfo: this.reportInfo,
      meetingType: this.meetingType,
    };

    this.http
      .post(this.addExaminationLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translate.t('toastr.saved_successfully'));
          window.location.reload();
        },
        error: (err) => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
