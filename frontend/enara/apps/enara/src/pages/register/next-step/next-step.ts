import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import DialogPrivacyPolicy from './dialog-privacy-policy/dialog-privacy-policy';
import { Translation } from '../../../../src/sevices/translation';
import { ToastrService } from 'ngx-toastr';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-next-step',
  imports: [MatRadioModule, MatCheckboxModule, FormsModule, RecaptchaModule,],
  templateUrl: './next-step.html',
  styleUrl: './next-step.css',
})
export default class NextStep {
  gender = '';
  accountType = '';
  maritalStatus = '';
  consultation = '';
  privacyPolicy = false;
  readonly dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  translate = inject(Translation);
  @Output() sendNextData = new EventEmitter<{
    gender: string;
    accountType: string;
    maritalStatus: string;
    consultation: string;
    privacyPolicy: boolean;
    captchaToken:string;
  }>();
  captchaToken: string | null = null;

  captchaResolved(token: string | null) {
    if (token) {
      this.captchaToken = token;
    } else {
      this.captchaToken = null;
    }
  }
  onGenderChanged(value: string) {
    this.gender = value;
  }
  onAccountTypeChanged(value: string) {
    this.accountType = value;
  }
  onMaritalStatusChanged(value: string) {
    this.maritalStatus = value;
  }
  onConsultationChanged(value: string) {
    this.consultation = value;
  }

  onPrivacyPolicyChange(value: boolean) {
    this.privacyPolicy = value;
    if (!this.captchaToken) {
      this.toastr.warning(this.translate.t('toastr.captcha_required'));
      return;
    }
    const data = {
      gender: this.gender,
      accountType: this.accountType,
      maritalStatus: this.maritalStatus,
      consultation: this.consultation,
      privacyPolicy: this.privacyPolicy,
      captchaToken: this.captchaToken
    };
    this.sendNextData.emit(data);
  }

  onPrivacyPolicy() {
    this.dialog.open(DialogPrivacyPolicy, {
      panelClass: 'privacy-policy-dialog',
    });
  }
}
