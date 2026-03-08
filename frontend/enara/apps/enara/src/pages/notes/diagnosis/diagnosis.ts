import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { apiUrl } from '../../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../sevices/auth-db';
import { Translation } from '../../../../src/sevices/translation';
import { DiagnosisInfo } from './IDiagnosisInfo';


@Component({
  selector: 'app-diagnosis',
  imports: [
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    JsonPipe,
  ],
  templateUrl: './diagnosis.html',
  styleUrl: './diagnosis.css',
})
export default class Diagnosis implements OnInit , OnChanges {
  diagnosisInfo = signal<DiagnosisInfo | null>(null);
  private readonly _formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  @Input() isDisabled!: boolean;
  translate = inject(Translation);

  readonly toppings = this._formBuilder.group({
    selfharm: false,
    harmingothers: false,
  });
  ngOnChanges() {
  if (this.isDisabled) {
    this.toppings.disable();
  } else {
    this.toppings.enable();
  }
}
  diseaseName = '';
  diagnosesNotes = '';
  accompanyingDiagnoses = '';
  severityOfDisorder = '';
  durationOfDisorder = '';
  ngOnInit() {
    this.toppings.valueChanges.subscribe(() => {
      this.emit();
    });
  }
  @Input() patientId!: string;
  @Output() diagnosis = new EventEmitter<{
    diseaseName: string;
    diagnosesNotes: string;
    accompanyingDiagnoses: string;
    severityOfDisorder: string;
    durationOfDisorder: string;
    riskLevel: string[];
  }>();

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
            error: () => {
              this.toastr.error(this.translate.t("toastr.faild_psychological_background"));
            },
          });
      });
    });

    effect(() => {
      const info = this.diagnosisInfo();
      if (!info) return;

      this.diseaseName = info.diseaseName;
      this.diagnosesNotes = info.diagnosesNotes;
      this.accompanyingDiagnoses = info.accompanyingDiagnoses;
      this.severityOfDisorder = info.severityOfDisorder;
      this.durationOfDisorder = info.durationOfDisorder;
      this.toppings.patchValue({
        selfharm: info.riskLevel?.includes('selfharm') ?? false,
        harmingothers: info.riskLevel?.includes('harmingothers') ?? false,
      });
      this.emit();
    });
  }

  emitDiseaseName(val: string) {
    this.diseaseName = val;
    this.emit();
  }
  emitAccompanyingDiagnoses(val: string) {
    this.accompanyingDiagnoses = val;
    this.emit();
  }
  emitDiagnosesNotes(val: string) {
    this.diagnosesNotes = val;
    this.emit();
  }
  emitSeverityOfDisorder(val: string) {
    this.severityOfDisorder = val;
    this.emit();
  }
  emitDurationOfDisorder(val: string) {
    this.durationOfDisorder = val;
    this.emit();
  }
  private emit() {
    const riskLevel: string[] = [];
    const values = this.toppings.value;
    if (values.selfharm) {
      riskLevel.push('selfharm');
    }
    if (values.harmingothers) {
      riskLevel.push('harmingothers');
    }

    this.diagnosis.emit({
      diseaseName: this.diseaseName,
      diagnosesNotes: this.diagnosesNotes,
      accompanyingDiagnoses: this.accompanyingDiagnoses,
      severityOfDisorder: this.severityOfDisorder,
      durationOfDisorder: this.durationOfDisorder,
      riskLevel: riskLevel,
    });
  }

  
}
