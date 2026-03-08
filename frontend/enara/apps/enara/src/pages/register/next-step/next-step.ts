import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import DialogPrivacyPolicy from './dialog-privacy-policy/dialog-privacy-policy';
import { Translation } from '../../../../src/sevices/translation';
@Component({
  selector: 'app-next-step',
  imports: [MatRadioModule, MatCheckboxModule, FormsModule],
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
  translate = inject(Translation);
  @Output() sendNextData = new EventEmitter<{
    gender: string;
    accountType: string;
    maritalStatus: string;
    consultation: string;
    privacyPolicy: boolean;
  }>();
  
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
    const data = {
      gender: this.gender,
      accountType: this.accountType,
      maritalStatus: this.maritalStatus,
      consultation: this.consultation,
      privacyPolicy: this.privacyPolicy,
    };

    this.sendNextData.emit(data);
  }

  onPrivacyPolicy() {
    this.dialog.open(DialogPrivacyPolicy, {
      panelClass: 'privacy-policy-dialog',
    });
  }
}
