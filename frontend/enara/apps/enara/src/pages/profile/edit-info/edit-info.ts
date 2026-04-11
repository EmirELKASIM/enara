import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { optionsData, PhoneNumber, UserInfo } from './iUserInfoEdit';
import { HttpClient } from '@angular/common/http';
import ToggleOptions from './toggle-options/toggle-options';
import ExperienceInformations from './experience-informations/experience-informations';
import SummaryInformations from './summary-informations/summary-informations';
import { EditInfoService } from '../../../sevices/edit-info-service';
import { AuthService } from '../../../sevices/auth-db';
import { apiUrl } from '../../../constants/constants';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Translation } from '../../../../src/sevices/translation';
import { CommonModule } from '@angular/common';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-edit-info',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    ToggleOptions,
    ExperienceInformations,
    SummaryInformations,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatProgressSpinnerModule,
    MatCardActions,
    MatDatepicker,
    MatIcon,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardSubtitle,
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './edit-info.html',
  styleUrl: './edit-info.css',
})
export default class EditInfo {
  public enable = false;
  public enabledInfoPressed = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  public isTablet: boolean =
    this.screenWidth >= 600 && this.screenWidth <= 1200;
  private auth = inject(AuthService);
  translate = inject(Translation);

  onEnabled() {
    this.enable = !this.enable;
    this.enabledInfoPressed = !this.enabledInfoPressed;
  }

  onResetInfo() {
    this.enable = false;
    this.enabledInfoPressed = false;
    this.firstName = this.computedFirstName();
    this.lastName = this.computedLastName();
    this.birthday = this.computedBirthday();
    this.gender = this.computedGender();
    this.maritalStatus = this.computedMaritalStatus();
    this.consultation = this.computedConsultation();
  }
  toggleInfo() {
    if (this.enable) {
      this.onResetInfo();
    } else {
      this.onEnabled();
    }
  }

  getToggleOptions(value: optionsData) {
    this.gender = value.gender;
    this.maritalStatus = value.maritalStatus;
    this.consultation = value.consultation;
  }
  id = '';
  firstName = '';
  lastName = '';
  birthday: Date | null = null;
  gender = '';
  maritalStatus = '';
  consultation = '';
  accountType = '';
  phoneNumber = '';
  info = signal<UserInfo | null>(null);
  private profileApi = `${apiUrl}/user/info`;
  private http = inject(HttpClient);
  private editInfoService = inject(EditInfoService);
  computedFirstName = computed(() => this.info()?.firstName ?? '');
  computedLastName = computed(() => this.info()?.lastName ?? '-');
  computedEmail = computed(() => this.info()?.email ?? '-');
  computedId = computed(() => this.info()?.id ?? '-');
  computedGender = computed(() => this.info()?.gender ?? '-');
  computedMaritalStatus = computed(() => this.info()?.maritalStatus ?? '-');
  computedBirthday = computed(() => {
    const b = this.info()?.birthday;
    return b ? new Date(b) : null;
  });
  computedConsultation = computed(() => this.info()?.consultation ?? '-');
  computedPhoneNumber = computed(() => this.info()?.phoneNumber ?? '-');
  isPersonal = computed(() => this.info()?.accountType === 'personal');
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  phoneForm = new FormGroup({
    phone: new FormControl<PhoneNumber | null>(null, [Validators.required]),
  });
  constructor() {
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
            this.info.set(res);
            this.firstName = res.firstName;
            this.lastName = res.lastName;
            this.gender = res.gender;
            this.maritalStatus = res.maritalStatus;
            this.birthday = res.birthday;
            this.consultation = res.consultation;
            this.phoneNumber = res.phoneNumber;
          },
          error: (err) => {
            console.log('error: ', err);
          },
        });
    });
  }

  checkData() {
    return this.editInfoService.checkData(
      this.firstName,
      this.lastName,
      this.birthday,
    );
  }
  isSubmitting = false;

  onUpdateSubmit() {
    const phoneData = this.phoneForm.value.phone;
  const fullPhoneNumber = phoneData?.e164Number || '';
    const formatedBirthday = this.birthday ? this.birthday.toISOString() : '';
    const dataIsTrue = this.checkData();
    if (!dataIsTrue) {
      return;
    } else {
      this.isSubmitting = true;
      this.editInfoService.onUpdateSubmit(
        this.computedId(),
        this.firstName,
        this.lastName,
        this.gender,
        this.maritalStatus,
        formatedBirthday,
        this.consultation,
        this.enable,
        fullPhoneNumber,
      );
    }
    this.isSubmitting = false;
  }
}
