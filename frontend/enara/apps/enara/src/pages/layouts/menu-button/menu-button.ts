import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Translation } from '../../../../src/sevices/translation';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../src/sevices/auth-db';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../src/constants/constants';

@Component({
  selector: 'app-menu-button',
  imports: [CommonModule, AsyncPipe, MatMenuModule],
  templateUrl: './menu-button.html',
  styleUrl: './menu-button.css',
})
export default class MenuButton implements OnInit {
  bookingNot = signal<any[]>([]);
  friendRequests = signal<any[]>([]);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  sideMenuOpen = false;
  translate = inject(Translation);
  public auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private GetBookingNot = `${apiUrl}/booking/notifications`;
  private GetFriendRequests = `${apiUrl}/request/notifications`;
  notificationsTotal = computed(() => {
    return (
      this.bookingNot().filter((n) => !n.read).length +
      this.friendRequests().filter((n) => !n.read).length
    );
  });
  openSideMenu() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  changeLang(lang: string) {
    this.translate.changeLang(lang);
  }
  goHome() {
    this.router.navigate(['']);
    this.sideMenuOpen = false;
  }
  goSessions() {
    this.router.navigate(['/sessions']);
    this.sideMenuOpen = false;
  }
  goProfile() {
    this.router.navigate(['/profile']);
    this.sideMenuOpen = false;
  }
  goAboutUs() {
    this.router.navigate(['/aboutus']);
    this.sideMenuOpen = false;
  }
  goNotifications() {
    this.router.navigate(['/notifications']);
    this.sideMenuOpen = false;
  }
  onLogout() {
    this.auth.logout();
    this.toastr.success(this.translate.t('toastr.logged_out_successfully'));
    this.router.navigate(['/login']);
    this.sideMenuOpen = false;
  }

  ngOnInit(): void {
    this.loadBookingNot();
    this.loadFrieandRequests();
  }
  async loadBookingNot() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get(this.GetBookingNot, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.bookingNot.set(res.token);
          console.log(res.token.read);
        },
      });
  }

  async loadFrieandRequests() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get(this.GetFriendRequests, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.friendRequests.set(res.token);
          console.log(this.friendRequests());
        },
      });
  }
}
