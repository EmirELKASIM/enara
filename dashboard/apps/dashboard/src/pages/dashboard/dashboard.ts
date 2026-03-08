import { Component } from '@angular/core';
import Users from './users/users';
import ExaminationRequests from './examination-requests/examination-requests';
import Examinations from './examinations/examinations';
import Appointments from './appointments/appointments';
import Bookings from './bookings/bookings';
import Earnings from './earnings/earnings';
import Login from '../login/login';
import { FormsModule } from '@angular/forms';
import { secretPass } from '../../constants/secretPass';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,Users, ExaminationRequests, Examinations, Appointments, Bookings, Earnings, Login],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard {
  isAuth = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  sideMenuOpen = false;
  currentView:
    | 'users'
    | 'requests'
    | 'examinations'
    | 'appointments'
    | 'bookings'
    | 'earnings'
    | null = null;
  openSideMenu() {
    this.sideMenuOpen = !this.sideMenuOpen;
  }
  showUsers() {
    this.currentView = 'users';
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
  showEarnings(){
    this.currentView = 'earnings';
    this.sideMenuOpen = false;
  }

  accessCode = '';
  checkCode() {
    if (this.accessCode === secretPass ) {
      return true;
    } else {
      return false;
    }
  }
  onSubmit() {
    const isTrue = this.checkCode();
    if (isTrue) {
      this.isAuth =true;
    }
  }
}
