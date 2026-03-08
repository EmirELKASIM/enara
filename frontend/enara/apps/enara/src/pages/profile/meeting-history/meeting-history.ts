import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../sevices/auth-db';
import { apiUrl } from '../../../constants/constants';
import { HistoryAppointmentsInfo, UserInfo } from './IAppointmentsInfo';
import { MatDialog } from '@angular/material/dialog';
import DialogDeleteMeeting from './dialog-delete-meeting/dialog-delete-meeting';
import { Translation } from '../../../../src/sevices/translation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting-history',
  standalone: true,
  imports: [HttpClientModule, MatIconModule, MatMenu, MatMenuTrigger, CommonModule],
  templateUrl: './meeting-history.html',
  styleUrl: './meeting-history.css',
})
export default class MeetingHistoryComponent {
  
  info = signal<UserInfo | null>(null);
  historyAppointments = signal<HistoryAppointmentsInfo[]>([]);
  filteredAppointments = signal<HistoryAppointmentsInfo[]>([]);

  currentFilter: 'all' | 'attendece' | 'canceled' | 'completed' = 'all';

  
  accountType = computed(() => this.info()?.accountType ?? '-');
  isDoctor = computed(() => this.accountType() !== 'personal');

  isEmpty = computed(() => this.filteredAppointments().length === 0);

  
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);

  
  private profileApi = `${apiUrl}/user/info`;
  private userHistoryApi = `${apiUrl}/booking/user-history`;
  private doctorHistoryApi = `${apiUrl}/booking/doctor-history`;

  constructor() {
    this.init();
  }

  
  async init() {
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
        next: (user) => {
          this.info.set(user);
          this.loadAppointments();
        },
        error: () => this.toastr.error(this.translate.t("toastr.failed_load_user_data")),
      });
  }

  
  async loadAppointments() {
    const token = await this.auth.getToken();
    if (!token) return;

    const url = this.isDoctor() ? this.doctorHistoryApi : this.userHistoryApi;

    this.http
      .get<any>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res) => {
          this.historyAppointments.set(res.token || []);

          this.applyFilter();
        },
        error: (err) => this.toastr.error(this.translate.t(`backend.booking_service.${err.error?.token}`)),
      });
  }

  
  filterByStatus(status: 'all' | 'attendece' | 'completed' | 'canceled') {
    this.currentFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredAppointments.set(this.historyAppointments());
    } else {
      this.filteredAppointments.set(
        this.historyAppointments().filter(
          (a) => a.status === this.currentFilter,
        ),
      );
    }
  }

  

  onDeleteItem(appointmentId: string) {
    const dialogRef  = this.dialog.open(DialogDeleteMeeting, {
      panelClass: 'delete-meeting-dialog',
      data: {
        appointmentId: appointmentId,
        isDoctor: this.isDoctor,
      },
    });
     dialogRef.afterClosed().subscribe((result) => {
    if (result === 'confirm') {
      this.historyAppointments.update((items) =>
        items.filter((i) => i._id !== appointmentId),
      );
    }

    this.applyFilter();
  });
  }

  
  getStatusLabel(status: string) {
    switch (status) {
      case 'attendece':
        return this.translate.t("meeting-history-details.status_labels.attendece");
      case 'completed':
        return this.translate.t("meeting-history-details.status_labels.completed");
      case 'canceled':
        return this.translate.t("meeting-history-details.status_labels.canceled");
      default:
        return '-';
    }
  }

  getPaymentStatus(status:boolean){
    switch(status){
      case false: 
         return this.translate.t("meeting-history-details.payment_status.false");
      case true: 
         return this.translate.t("meeting-history-details.payment_status.true");
      default: 
         return "-";
    }
  }

  getInitials(a: any) {
    const name = this.isDoctor() ? a.firstName : a.doctorFirstName;
    return name?.charAt(0) ?? '?';
  }

  formatTime(time: string) {
    return time ? time.slice(0, 5) : '--';
  }

  getAttendanceCount() {
    return this.historyAppointments().filter((a) => a.status === 'attendece')
      .length;
  }

  getCompletedCount() {
    return this.historyAppointments().filter((a) => a.status === 'completed')
      .length;
  }

  getCanceledCount() {
    return this.historyAppointments().filter((a) => a.status === 'canceled')
      .length;
  }


}
