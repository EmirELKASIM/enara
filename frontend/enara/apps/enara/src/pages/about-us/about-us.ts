import { Component, computed, effect, inject, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserInfo } from '../home/IUserInfo';
import { AuthService } from '../../sevices/auth-db';
import { apiUrl } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Translation } from '../../sevices/translation';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export default class AboutUs {
  info = signal<UserInfo | null>(null);
  private router = inject(Router);
  private auth = inject(AuthService);
  private profileApi = `${apiUrl}/user/info`;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  translate = inject(Translation);

  computedAccountType = computed(() => this.info()?.accountType ?? '-');
  goLogin() {
    this.router.navigate(['login']);
  }
  isAuth() {
    const isAuth =
      this.computedAccountType() === 'personal' ||
      this.computedAccountType() === 'psychotherapist' ||
      this.computedAccountType() === 'psychiatrist';
    if (!isAuth) {
      return false;
    } else {
      return true;
    }
  }
  copyEmail() {
    const email = 'enara.support@gmail.com';
    navigator.clipboard
      .writeText(email)
      .then(() => {
        this.toastr.success("تم نسخ البريد")
      })
      .catch((err) => {
        console.error('فشل النسخ: ', err);
      });
  }
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');

      this.http
        .get<UserInfo>(this.profileApi, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res) => {
            this.info.set(res);
          },
          error: (err) => {
            console.log('error: ', err);
          },
        });
    });
  }
}
