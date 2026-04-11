import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Location } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs/operators';
import { BackButtonService } from '../../sevices/back-button-service';
import { AuthService } from '../../sevices/auth-db';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../constants/constants';
import { MatDivider } from '@angular/material/divider';
import { Translation } from '../../sevices/translation';
import { UserInfo } from './IUserInfo';
import MenuButton from './menu-button/menu-button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layouts',
  imports: [
    MatTabsModule,
    AsyncPipe,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDivider,
    CommonModule,
    MenuButton,
  ],
  templateUrl: './layouts.html',
  styleUrl: './layouts.css',
})
export default class Layouts {
  info = signal<UserInfo | null>(null);
  bookingNot = signal<any[]>([]);
  friendRequests = signal<any[]>([]);
  translate = inject(Translation);
  private router = inject(Router);
  public auth = inject(AuthService);
  selectedIndex = 0;
  backService = inject(BackButtonService);
  location = inject(Location);
  private http = inject(HttpClient);
  private profileApi = `${apiUrl}/user/info`;
  accountType = computed(() => this.info()?.accountType ?? null);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  public isTablet: boolean = this.screenWidth >= 600  && this.screenWidth <= 1200;

  private toastr = inject(ToastrService);
  private GetBookingNot = `${apiUrl}/booking/notifications`;
  private GetFriendRequests = `${apiUrl}/request/notifications`;
  notificationsTotal = computed(() => {
  return (
    this.bookingNot().filter(n => !n.read).length +
    this.friendRequests().filter(n => !n.read).length
  );
});
  isDoctor = computed(() => {
    const type = this.accountType();
    if (!type) return false; 
    return type === 'psychologist' || type === 'psychiatrist';
  });
  goBack() {
    this.location.back();
    this.backService.hide();
  }
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncTabWithRoute();
      });

    this.loadProfile();
  }

  async loadProfile() {
    const token = await this.auth.getToken();
    if (!token) return;

    this.http
      .get<UserInfo>(this.profileApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res) => this.info.set(res),
        error: (err) => console.log(err.error?.token || ''),
      });
  }
  goHome() {
    this.router.navigate(['/']);
    this.backService.hide();
  }

  goAboutUs() {
    this.router.navigate(['/aboutus']);
    this.backService.hide();
  }

  goLogin() {
    this.router.navigate(['/login']);
    this.backService.hide();
  }

  goProfile() {
    this.router.navigate(['/profile']);
    this.backService.hide();
  }
  goSessions() {
    this.router.navigate(['/sessions']);
    this.backService.hide();
  }
  goNotifications() {
    this.router.navigate(['/notifications']);
    this.backService.hide();
    this.loadBookingNot();
  this.loadFrieandRequests();
  }
  onLogout() {
    this.auth.logout();
    this.toastr.success(this.translate.t('toastr.logged_out_successfully'));
    this.router.navigate(['/login']);
  }
  onTabChange(index: number) {
    const routes = this.getTabsRoutes();
    if (routes[index]) {
      this.router.navigate([routes[index]]);
      this.backService.hide();
    }
  }
  changeLang(lang: string) {
    this.translate.changeLang(lang);
  }
  private syncTabWithRoute() {
    const routes = this.getTabsRoutes();
    const url = this.router.url;

    const index = routes.findIndex((route) => {
      if (route === '/') {
        return url === '/';
      }
      return url.startsWith(route);
    });

    if (index !== -1) {
      this.selectedIndex = index;
    }
  }

  private getTabsRoutes(): string[] {
    const routes = ['/', '/aboutus'];

    if (this.auth.isLoggedInSync()) {
      routes.push('/sessions', '/profile');
    } else {
      routes.push('/login');
    }

    return routes;
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
