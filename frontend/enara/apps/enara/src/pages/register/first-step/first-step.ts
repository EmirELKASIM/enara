import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../sevices/register-service';
import { Translation } from '../../../../src/sevices/translation';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';

import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
type PhoneNumber = {
  number: string;
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
};
@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
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

  firstNameError = '';
  lastNameError = '';
  emailError = '';
  birthdayError = '';
  passwordError = '';
  confirmPasswordError = '';
  phoneNumberError = '';

  next = false;
  isLoading = false;
  focusedField = '';

  showPassword = false;
  showConfirmPassword = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  public isTablet: boolean =
    this.screenWidth >= 600 && this.screenWidth <= 1200;

  get passwordsMatch() {
    return this.password === this.confirmPassword;
  }

  get hasMinLength() {
    return this.password?.length >= 8;
  }

  get hasUpperCase() {
    return /[A-Z]/.test(this.password || '');
  }

  get hasNumber() {
    return /[0-9]/.test(this.password || '');
  }

  get hasSpecialChar() {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password || '');
  }
  @Output() sendFirstData = new EventEmitter<{
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    phoneNumber: string;
    next: boolean;
  }>();
  private router = inject(Router);
  private registerService = inject(RegisterService);
  translate = inject(Translation);
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  phoneForm = new FormGroup({
    phone: new FormControl<PhoneNumber | null>(null, [Validators.required]),
  });
  
  openDatePicker(event: any) {
    const input: HTMLInputElement = event.target;
    input.showPicker?.(); 
  }
  goLogin() {
    this.router.navigate(['login']);
  }

  checkData() {
    const phoneData = this.phoneForm.value.phone;
  const fullPhoneNumber = phoneData?.e164Number || '';
    return this.registerService.firstStepCheckData(
      this.firstName,
      this.lastName,
      this.birthday,
      this.email,
      this.password,
      this.confirmPassword,
      fullPhoneNumber,
    );
  }

  onSendData() {
    this.next = true;
const phoneData = this.phoneForm.value.phone;
  const fullPhoneNumber = phoneData?.e164Number || '';
    if (!this.checkData()) return;

    this.sendFirstData.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      birthday: this.birthday,
      email: this.email,
      password: this.password,
      phoneNumber: fullPhoneNumber,
      next: this.next,
    });
  }

  isFormValid() {
    const phoneData = this.phoneForm.value.phone;
  const fullPhoneNumber = phoneData?.e164Number || '';
    const validData =
      this.firstName === '' ||
      this.lastName === '' ||
      this.birthday === '' ||
      this.email === '' ||
      this.password === '' ||
      this.confirmPassword === '' ||
      fullPhoneNumber === '';

    if (validData ) {
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

  
}
