import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import NextStep from './next-step/next-step';
import FirstStep from './first-step/first-step';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../sevices/register-service';
import { firstData, nextData } from './ISteps';
import { Translation } from '../../sevices/translation';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RecaptchaModule } from 'ng-recaptcha';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FirstStep,
    NextStep,
    FormsModule,
    RecaptchaModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {
  firstName = '';
  lastName = '';
  email = '';
  birthday = '';
  password = '';
  gender = '';
  accountType = '';
  maritalStatus = '';
  consultation = '';
  phoneNumber = '';
  codeNumber = '';
  privacyPolicy = false;
  next = false;
  acceptedFromChild = false;
  translate = inject(Translation);
  captchaToken: string | null = null;

  private toastr = inject(ToastrService);
  private registerService = inject(RegisterService);
  onAcceptedFromChild(value: boolean) {
    this.acceptedFromChild = value;
  }
  onBack() {
    this.next = false;
  }

  

  onResToFirstData(value: firstData) {
    this.firstName = value.firstName;
    this.lastName = value.lastName;
    this.email = value.email;
    this.birthday = value.birthday;
    this.password = value.password;
    this.phoneNumber = value.phoneNumber;
    this.codeNumber = value.codeNumber;
    this.next = value.next;
  }
  onResToNextData(value: nextData) {
    this.gender = value.gender;
    this.accountType = value.accountType;
    this.maritalStatus = value.maritalStatus;
    this.consultation = value.consultation;
    this.privacyPolicy = value.privacyPolicy;
    this.captchaToken = value.captchaToken;
  }

  checkData() {
    const validOptions =
      this.gender.trim().length > 0 &&
      this.accountType.trim().length > 0 &&
      this.maritalStatus.trim().length > 0 &&
      this.consultation.trim().length > 0 &&
      this.privacyPolicy == true;
    if (!validOptions) {
      this.toastr.warning(this.translate.t('toastr.selections_must_filled'));
      this.next = false;
      return false;
    }
    return true;
  }
  submitForm() {
    const isTrue = this.checkData();
    if (!this.captchaToken) {
      this.toastr.warning(this.translate.t('toastr.captcha_required'));
      return;
    }
    if (!isTrue) {
      return;
    } else {
      this.registerService.registerOnSubmitForm(
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.birthday,
        this.gender,
        this.accountType,
        this.maritalStatus,
        this.consultation,
        this.privacyPolicy,
        this.phoneNumber,
        this.codeNumber,
        this.captchaToken,
      );
    }
  }
  changeLang(lang: string) {
    this.translate.changeLang(lang);
  }
}
