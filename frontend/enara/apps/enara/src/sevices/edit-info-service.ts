import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiUrl } from '../constants/constants';
import { BackButtonService } from './back-button-service';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class EditInfoService {
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private updateInfoLink = `${apiUrl}/user/update`;
  private router = inject(Router);
  backService = inject(BackButtonService);
  translate = inject(Translation);
  checkData(firstName: string, lastName: string, birthday: Date | null) {
    const validName = firstName.length != 0 && lastName.length != 0;
    const validBirthday = !!birthday;
    if (!validName) {
      this.toastr.warning(this.translate.t('toastr.invalid_full_name'));
      return false;
    } else if (!validBirthday) {
      this.toastr.warning(this.translate.t('toastr.invalid_date'));
      return false;
    }
    return true;
  }
  onUpdateSubmit(
    id: string,
    firstName: string,
    lastName: string,
    gender: string,
    maritalStatus: string,
    birthday: string,
    consultation: string,
    enable: boolean,
    phoneNumber: string,
    codeNumber: string,
  ) {
    const data = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      maritalStatus: maritalStatus,
      birthday: birthday,
      consultation: consultation,
      phoneNumber: phoneNumber,
      codeNumber: codeNumber,
    };
    this.http
      .put(this.updateInfoLink, data, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.updated_successfully'));
          enable = false;
          this.router.navigate(['']);
          this.backService.hide();
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
