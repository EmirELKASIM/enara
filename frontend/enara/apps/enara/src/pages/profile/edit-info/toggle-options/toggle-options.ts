import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { UserInfo } from '../iUserInfoEdit';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-toggle-options',
  imports: [
    FormsModule,
    MatRadioModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './toggle-options.html',
  styleUrl: './toggle-options.css',
})
export default class ToggleOptions implements OnChanges {
  gender = '';
  maritalStatus = '';
  consultation = '';
  optionsInfo = signal<UserInfo | null>(null);
  translate = inject(Translation);

  @Input() isEnabled!: boolean;
  @Output() sendToggleOptions = new EventEmitter<{
    gender: string;
    maritalStatus: string;
    consultation: string;
  }>();
  onGenderChanged(val: string) {
    this.gender = val;
    this.emitData();
  }
  onMaritalStatusChanged(val: string) {
    this.maritalStatus = val;
    this.emitData();
  }
  onConsultationChanged(val: string) {
    this.consultation = val;
    this.emitData();
  }
  emitData() {
    this.sendToggleOptions.emit({
      gender: this.gender,
      maritalStatus: this.maritalStatus,
      consultation: this.consultation,
    });
  }

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private profileApi = `${apiUrl}/user/info`;
  computedGender = computed(() => this.optionsInfo()?.gender ?? '-');
  computedMaritalStatus = computed(
    () => this.optionsInfo()?.maritalStatus ?? '-',
  );
  computedConsultation = computed(
    () => this.optionsInfo()?.consultation ?? '-',
  );
  ngOnChanges() {
    this.onResetInfo();
  }
  onResetInfo() {
    if (!this.isEnabled) {
      this.gender = this.computedGender();
      this.maritalStatus = this.computedMaritalStatus();
      this.consultation = this.computedConsultation();
    }
    return;
  }

  constructor() {
    effect(() => {
      this.sendToggleOptions.emit({
        gender: this.gender,
        maritalStatus: this.maritalStatus,
        consultation: this.consultation,
      });
    });
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get<UserInfo>(this.profileApi, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res) => {
            this.optionsInfo.set(res);
            this.gender = res.gender;
            this.maritalStatus = res.maritalStatus;
            this.consultation = res.consultation;
          },
          error: (err) => {
            console.log('error: ', err);
          },
        });
    });
  }
}
