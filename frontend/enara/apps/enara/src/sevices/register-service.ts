import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiUrl } from '../constants/constants';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private toastr = inject(ToastrService);
  private registerApi = `${apiUrl}/user/register`;
  private http = inject(HttpClient);
  private router = inject(Router);
  translate = inject(Translation);
  firstStepCheckData(
    firstName: string,
    lastName: string,
    birthday: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
    codeNumber: string,
  ) {
    const validName = firstName.length != 0 && lastName.length != 0;
    const validBirthday = birthday.trim().length > 0;
    const validEmail = email.includes('@') && email.includes('.com');
    const validPassword = password.length > 5;
    const matchPassword = password === confirmPassword;
    const validPhoneNumber =
      phoneNumber.length != 0 && phoneNumber.length === 10;
    const validCodeNumber =
      codeNumber.length != 0 &&
      codeNumber.length <= 4 &&
      codeNumber.includes('+');
    if (!validName) {
      this.toastr.warning(this.translate.t('toastr.invalid_full_name'));
      return false;
    } else if (!validBirthday) {
      this.toastr.warning(this.translate.t('toastr.invalid_date'));
      return false;
    } else if (!validEmail) {
      this.toastr.warning(this.translate.t('toastr.invalid_email'));
      return false;
    } else if (!validPassword) {
      this.toastr.warning(
        this.translate.t('toastr.password_should_least_characters'),
      );
      return false;
    } else if (!matchPassword) {
      this.toastr.warning(this.translate.t('toastr.check_confirm_password'));
      return false;
    } else if (!validPhoneNumber) {
      this.toastr.warning(
        this.translate.t('toastr.phone_number_should_digits'),
      );
      return false;
    }
    if (!validCodeNumber) {
      this.toastr.warning(this.translate.t('toastr.check_code_number'));
      return false;
    } else {
      return true;
    }
  }
  registerOnSubmitForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthday: string,
    gender: string,
    accountType: string,
    maritalStatus: string,
    consultation: string,
    privacyPolicy: boolean,
    phoneNumber: string,
    codeNumber: string,
    captcha:string,
  ) {
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthday: birthday,
      password: password,
      gender: gender,
      accountType: accountType,
      maritalStatus: maritalStatus,
      consultation: consultation,
      privacyPolicy: privacyPolicy,
      phoneNumber: phoneNumber,
      codeNumber: codeNumber,
      captcha:captcha
    };
    console.log(data);
    
    this.http
      .post(this.registerApi, data, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(
            this.translate.t('toastr.registration_successful'),
          );
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err.error);
          
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
