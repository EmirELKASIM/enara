import { Component, inject, OnInit } from '@angular/core';
import Users from './users/users';
import ExaminationRequests from './examination-requests/examination-requests';
import Examinations from './examinations/examinations';
import Appointments from './appointments/appointments';
import Bookings from './bookings/bookings';
import Earnings from './earnings/earnings';
import { FormsModule } from '@angular/forms';

import DoctorsAccounts from './doctors-accounts/doctors-accounts';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    Users,
    DoctorsAccounts,
    ExaminationRequests,
    Examinations,
    Appointments,
    Bookings,
    Earnings,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard implements OnInit {
  isAuth = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  private http = inject(HttpClient);
  sideMenuOpen = false;
  
  currentView:
    | 'users'
    | 'doctorsAccounts'
    | 'requests'
    | 'examinations'
    | 'appointments'
    | 'bookings'
    | 'earnings'
    | null = null;
  ngOnInit() {
    this.isAuth = localStorage.getItem('isAuth') === 'true';
  }
  openSideMenu() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  showUsers() {
    this.currentView = 'users';
    this.sideMenuOpen = false;
  }
  showDoctorsAccounts() {
    this.currentView = 'doctorsAccounts';
    this.sideMenuOpen = false;
  }
  showRequests() {
    this.currentView = 'requests';
    this.sideMenuOpen = false;
  }
  showExaminations() {
    this.currentView = 'examinations';
    this.sideMenuOpen = false;
  }
  showAppointments() {
    this.currentView = 'appointments';
    this.sideMenuOpen = false;
  }
  showBookings() {
    this.currentView = 'bookings';
    this.sideMenuOpen = false;
  }
  showEarnings() {
    this.currentView = 'earnings';
    this.sideMenuOpen = false;
  }

  accessCode = '';
  isLoading = false;
  checkCode() {
    this.isLoading = true;
    this.http
      .post(`${environment.apiUrl}/check-pass`, {
        pass: this.accessCode,
      })
      .subscribe((res: any) => {
        console.log(res);
        this.isLoading = false;

        if (res.success) {
          localStorage.setItem('isAuth', 'true');
          this.isAuth = true;
        } else {
          alert('Wrong code ❌');
        }
      });
  }

  onSubmit() {
    this.checkCode();
  }
}
