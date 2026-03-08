import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth-db';
import { apiUrl } from '../constants/constants';
import { BackButtonService } from './back-button-service';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private toastr = inject(ToastrService);
  private resetPasswordLink = `${apiUrl}/user/change-password`;
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  backService = inject(BackButtonService);
  translate = inject(Translation);

  checkData(newPassword: string, confirmNewPassword: string) {
    const validPassword = newPassword.length > 6;
    const confirmedPassword = newPassword === confirmNewPassword;
    if (!validPassword) {
      this.toastr.warning(this.translate.t('toastr.must_greater_than'));
      return false;
    } else if (!confirmedPassword) {
      this.toastr.warning(this.translate.t('toastr.error_confirming_password'));
      return false;
    } else {
      return true;
    }
  }
  async onChangePass(newPassword: string, oldPassword: string) {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const data = {
      token: token,
      newPassword: newPassword,
      oldPassword: oldPassword,
    };
    this.http
      .post(this.resetPasswordLink, data, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.password_changed'));
          this.router.navigate(['']);
          this.backService.hide();
        },
        error: (err) => {
          console.log(err.error?.token);
        },
      });
  }
}
