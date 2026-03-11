import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../sevices/auth-db';
import { apiUrl } from '../../constants/constants';
import DialogForgotPassword from './dialog-forgot-password/dialog-forgot-password';
import { MatDialog } from '@angular/material/dialog';
import { Translation } from '../../sevices/translation';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HttpClientModule,MatToolbarModule,MatButtonModule, MatMenuModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  emailError = '';
  passwordError = '';
  translate = inject(Translation);

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private auth = inject(AuthService);
  readonly dialog = inject(MatDialog);

  private loginApi = `${apiUrl}/user/login`;

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = emailRegex.test(this.email) ? '' : 'Invalid email format';
  }

  validatePassword() {
    this.passwordError =
      this.password.length >= 6 ? '' : 'Password must be at least 6 characters';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goRegister() {
    this.router.navigate(['register']);
  }

  onSubmit() {
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) return;

    this.isLoading = true;

    this.http
      .post<any>(
        this.loginApi,
        {
          email: this.email,
          password: this.password,
        },
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      )
      .subscribe({
        next: (res) => {
          this.auth.setToken(res.token);
          this.toastr.success(this.translate.t('toastr.welcome'));
          this.router.navigate(['']);
          this.isLoading = false;
        },
        error: (err) => {
          const message = err.error?.token;
          this.toastr.warning(message);
          this.isLoading = false;
        },
      });
  }
 changeLang(lang: string) {
    this.translate.changeLang(lang);
  }
  onForgotPasswordDialog() {
    this.dialog.open(DialogForgotPassword, {
      panelClass: 'forgot-password-dialog',
    });
  }
}
