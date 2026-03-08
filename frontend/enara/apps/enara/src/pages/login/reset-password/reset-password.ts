import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiUrl } from '../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Translation } from '../../../../src/sevices/translation';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export default class ResetPassword implements OnInit {
  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  private resetPasswordLink = `${apiUrl}/user/reset-password`;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  translate = inject(Translation);
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
    });
  }

  submit() {
    if (!this.token) {
      alert('Invalid or missing token');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const data = {
      token: this.token,
      newPassword: this.newPassword,
    };

    this.http
      .post(this.resetPasswordLink, data, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
          this.toastr.success(this.translate.t("toastr.password_sent"));
        },
        error: (err) => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
  returnLogin() {
    this.router.navigate(['login']);
  }
}
