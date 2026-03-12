import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../sevices/register-service';
import { Translation } from '../../../../src/sevices/translation';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './first-step.html',
  styleUrl: './first-step.css',
})
export default class FirstStep {
  firstName = '';
  lastName = '';
  email = '';
  birthday = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  codeNumber = '';

  firstNameError = '';
  lastNameError = '';
  emailError = '';
  birthdayError = '';
  passwordError = '';
  confirmPasswordError = '';
  phoneNumberError = '';
  codeNumberError = '';

  next = false;
  isLoading = false;
  focusedField = '';

  showPassword = false;
  showConfirmPassword = false;

  passwordsMatch = true;

  hasSpecialChar = false;
  hasNumber = false;
  hasUpperCase = false;
  hasMinLength = false;

  @Output() sendFirstData = new EventEmitter<{
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    phoneNumber: string;
    codeNumber: string;
    next: boolean;
  }>();
  private router = inject(Router);
  private registerService = inject(RegisterService);
  translate = inject(Translation);
 openDatePicker(event: any) {
  const input: HTMLInputElement = event.target;
  input.showPicker?.(); // showPicker متاحة في بعض المتصفحات الحديثة
}
  goLogin() {
    this.router.navigate(['login']);
  }

  checkData() {
    return this.registerService.firstStepCheckData(
      this.firstName,
      this.lastName,
      this.birthday,
      this.email,
      this.password,
      this.confirmPassword,
      this.phoneNumber,
      this.codeNumber,
    );
  }

  onSendData() {
    this.next = true;

    if (!this.checkData()) return;

    this.sendFirstData.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      birthday: this.birthday,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      codeNumber: this.codeNumber,
      next: this.next,
    });
  }

  isFormValid() {
    const validData =
      this.firstName === '' ||
      this.lastName === '' ||
      this.birthday === '' ||
      this.email === '' ||
      this.password === '' ||
      this.phoneNumber === '' ||
      this.codeNumber === '';

    if (validData) {
      return false;
    } else {
      return true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onInputFocus(value: string) {
    this.focusedField = value;
  }

  // ====== HEADER ======
  stepTitle = this.translate.t('first-step.step_title');
  stepDescription = this.translate.t('first-step.step_description');

  // ====== LABELS ======
  firstNameLabel = this.translate.t('first-step.first_name_label');
  firstNamePlaceholder = this.translate.t('first-step.first_name_placeholder');

  lastNameLabel = this.translate.t('first-step.last_name_label');
  lastNamePlaceholder = this.translate.t('first-step.last_name_placeholder');

  emailLabel = this.translate.t('first-step.email_label');
  emailPlaceholder = this.translate.t('first-step.email_placeholder');

  birthdayLabel = this.translate.t('first-step.birthday_label');

  passwordLabel = this.translate.t('first-step.password_label');
  passwordPlaceholder = this.translate.t('first-step.password_placeholder');

  passwordStrengthLabel = this.translate.t(
    'first-step.password_strength_label',
  );
  passwordReqLength = this.translate.t(
    'first-step.password_requirement_length',
  );
  passwordReqUpper = this.translate.t(
    'first-step.password_requirement_uppercase',
  );
  passwordReqNumber = this.translate.t(
    'first-step.password_requirement_number',
  );
  passwordReqSpecial = this.translate.t(
    'first-step.password_requirement_special',
  );

  confirmPasswordLabel = this.translate.t('first-step.confirm_password_label');
  confirmPasswordPlaceholder = this.translate.t(
    'first-step.confirm_password_placeholder',
  );

  passwordsMatchText = this.translate.t('first-step.passwords_match');

  phoneNumberLabel = this.translate.t('first-step.phone_number_label');

  // ====== BUTTONS ======
  loginButtonText = this.translate.t('first-step.login_button');
  nextButtonText = this.translate.t('first-step.next_button');

  // ====== NOTES ======
  requiredFieldsNote = this.translate.t('first-step.required_fields_note');
  privacyProtectionNote = this.translate.t(
    'first-step.privacy_protection_note',
  );
}
