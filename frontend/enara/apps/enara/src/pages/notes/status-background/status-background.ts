import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { apiUrl } from '../../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../sevices/auth-db';
import { Translation } from '../../../../src/sevices/translation';
import { DiagnosisInfo } from './IDiagnosisInfo';


@Component({
  selector: 'app-status-background',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './status-background.html',
  styleUrl: './status-background.css',
})
export default class StatusBackground {
  diagnosisInfo = signal<DiagnosisInfo | null>(null);

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  clinicalHistory = '';
  sawDoctorBefore = '';
  sleepedAtHospital = '';
  drankMedicinesBefore = '';
  @Input() patientId!: string;
  @Input() isDisabled!: boolean;
  translate = inject(Translation);

  @Output() backgroundStatus = new EventEmitter<{
    clinicalHistory: string;
    sawDoctorBefore: string;
    sleepedAtHospital: string;
    drankMedicinesBefore: string;
  }>();
 

 constructor() {

  effect(() => {
    if (!this.patientId) return;

    const diagnosisLink = `${apiUrl}/diagnosis/info/${this.patientId}`;

    this.auth.getToken().then(token => {
      if (!token) return;

      this.http.get(diagnosisLink, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      }).subscribe({
        next: (res: any) => {
          this.diagnosisInfo.set(res.token);
        },
        error: () => {
          this.toastr.error(this.translate.t("toastr.faild_psychological_background"));
        }
      });
    });
  });

  effect(() => {
    const info = this.diagnosisInfo();
    if (!info) return;
    
    this.clinicalHistory = info.clinicalHistory;
    this.sawDoctorBefore = info.sawDoctorBefore;
    this.sleepedAtHospital = info.sleepedAtHospital;
    this.drankMedicinesBefore = info.drankMedicinesBefore;

    this.emit();
  });

}


  emitClinicalHistory(val: string) {
    this.clinicalHistory = val;
    this.emit();
  }
  emitSawDoctorBefore(val: string) {
    this.sawDoctorBefore = val;
    this.emit();
  }
  emitSleepedAtHospital(val: string) {
    this.sleepedAtHospital = val;
    this.emit();
  }
  emitDrankMedicinesBefore(val: string) {
    this.drankMedicinesBefore = val;
    this.emit();
  }

  private emit() {
    this.backgroundStatus.emit({
      clinicalHistory: this.clinicalHistory,
      sawDoctorBefore: this.sawDoctorBefore,
      sleepedAtHospital: this.sleepedAtHospital,
      drankMedicinesBefore: this.drankMedicinesBefore,
    });
  }
}
