import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  bookedAppointmentsInfo,
  experienceInfo,
  SummaryInfo,
  UserInfo,
} from './iUserInfo';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../sevices/auth-db';
import { apiUrl } from '../../../constants/constants';
import { MatDialog } from '@angular/material/dialog';
import DialogDoctorStartMeeting from './dialog-doctor-start-meeting/dialog-doctor-start-meeting';
import DialogUserStartMeeting from './dialog-user-start-meeting/dialog-user-start-meeting';
import DialogCancelMeeting from './dialog-cancel-meeting/dialog-cancel-meeting';
import { Router } from '@angular/router';
import DialogEditAppointment from './dialog-edit-appointment/dialog-edit-appointment';
import DialogSendEditRequest from './dialog-send-edit-request/dialog-send-edit-request';
import DialogShowChangeDetails from './dialog-show-change-details/dialog-show-change-details';
import DialogPayment from './dialog-payment/dialog-payment';
import DialogDekontDetails from './dialog-dekont-details/dialog-dekont-details';
import { Translation } from '../../../../src/sevices/translation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-info',
  imports: [MatIconModule, CommonModule],
  templateUrl: './show-info.html',
  styleUrl: './show-info.css',
})
export default class ShowInfo {
  info = signal<UserInfo | null>(null);
  summaryInfo = signal<SummaryInfo | null>(null);
  experienceInfo = signal<experienceInfo | null>(null);
  appointmentsInfo = signal<bookedAppointmentsInfo[] | null>(null);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  private profileApi = `${apiUrl}/user/info`;
  private summaryApi = `${apiUrl}/summary/info`;
  private experienceApi = `${apiUrl}/experience/info`;
  private bookingAppointmentsForUserApi = `${apiUrl}/booking/user-info`;
  private bookingAppointmentsForDoctorApi = `${apiUrl}/booking/doctor-info`;
  private router = inject(Router);
  private auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private http = inject(HttpClient);
  translate = inject(Translation);

  firstName = computed(() => this.info()?.firstName ?? '');
  lastName = computed(() => this.info()?.lastName ?? '-');
  email = computed(() => this.info()?.email ?? '-');
  accountType = computed(() => this.info()?.accountType ?? '-');
  gender = computed(() => this.info()?.gender ?? '-');
  maritalStatus = computed(() => this.info()?.maritalStatus ?? '-');
  age = computed(() => this.info()?.age ?? '-');
  phoneNumber = computed(() => this.info()?.phoneNumber ?? '-');
  codeNumber = computed(() => this.info()?.codeNumber ?? '-');
  psychologicalSummary = computed(
    () => this.summaryInfo()?.psychologicalSummary,
  );
  experienceSummary = computed(() => this.experienceInfo()?.experienceSummary);
  experienceDesc = computed(() => this.experienceInfo()?.experienceDesc);
  certificates = computed(() => this.experienceInfo()?.certificates);
  language = computed(() => this.experienceInfo()?.language);
  isPersonal = computed(() => this.accountType() === 'personal');

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
            console.log(this.info());
          },
          error: (err) => {
            console.log(err.error?.token);
          },
        });
    });

    effect(async () => {
      if (!this.info()) return;
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      const headers = {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      };

      if (this.isPersonal()) {
        this.http.get<SummaryInfo>(this.summaryApi, { headers }).subscribe({
          next: (res: any) => this.summaryInfo.set(res.token),
          error: (err) => console.log(err),

        });
      } else {
        this.http
          .get<experienceInfo>(this.experienceApi, { headers })
          .subscribe({
            next: (res: any) => this.experienceInfo.set(res.token),
            error: (err) => console.log(err),
          });
      }
    });

    effect(async () => {
      if (!this.info()) return;
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');

      if (this.isPersonal()) {
        this.http
          .get<bookedAppointmentsInfo>(this.bookingAppointmentsForUserApi, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .subscribe({
            next: (res: any) => {
              this.appointmentsInfo.set(res.token);
            },

            error: (err) => console.log(err.error?.token ),
          });
      } else {
        this.http
          .get<bookedAppointmentsInfo>(this.bookingAppointmentsForDoctorApi, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .subscribe({
            next: (res: any) => this.appointmentsInfo.set(res.token),

            error: (err) => console.log(err.error?.token ),
            
          });
      }
    });
  }
  splitToLines(text: string): string[] {
    if (!text) return [];
    return text
      .split('.')
      .map((s) => s.trim())
      .filter((s) => s.length);
  }

  async onAppoitmentCanceled(
    appointmentId: string,
    appointmentDate: string,
    appointmentTime: string,
    doctorId: string,
  ) {
    const dialogRef = this.dialog.open(DialogCancelMeeting, {
      panelClass: 'cancel-meeting-dialog',
      data: {
        appointmentId: appointmentId,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        doctorId: doctorId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.canceled) {
        this.appointmentsInfo.update((list) =>
          list ? list.filter((a: any) => a._id !== result.appointmentId) : list,
        );
      }
    });
  }
  onStartMeetingForDoctor(
    appointmentId: string,
    patientFirstName: string,
    patientLastName: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    this.dialog.open(DialogDoctorStartMeeting, {
      panelClass: 'doctor-start-meeting-dialog',
      data: {
        appointmentId: appointmentId,
        patientFirstName: patientFirstName,
        patientLastName: patientLastName,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
      },
    });
  }
  onStartMeetingForUser(
    appointmentId: string,
    doctorFirstName: string,
    doctorLastName: string,
  ) {
    this.dialog.open(DialogUserStartMeeting, {
      panelClass: 'user-start-meeting-dialog',
      data: {
        appointmentId: appointmentId,
        doctorFirstName: doctorFirstName,
        doctorLastName: doctorLastName,
      },
    });
  }
  onEditAppointmentForDoctor(bookingId: string) {
    this.dialog.open(DialogEditAppointment, {
      panelClass: 'edit-appointment-dialog',
      data: {
        bookingId: bookingId,
      },
    });
  }

  onPayment(
    appointmentId: string,
    appointmentDate: string,
    appointmentTime: string,
    appointmentPrice: string,
    appointmentCoinType: string,
  ) {
    this.dialog.open(DialogPayment, {
      panelClass: 'payment-dialog',
      data: {
        appointmentId: appointmentId,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        appointmentPrice: appointmentPrice,
        appointmentCoinType: appointmentCoinType,
      },
    });
  }
  onShowDekontDetails(appointmentId: string, patientId: string) {
    this.dialog.open(DialogDekontDetails, {
      panelClass: 'dekont-details-dialog',
      data: {
        appointmentId: appointmentId,
        patientId: patientId,
      },
    });
  }

  goBooking() {
    this.router.navigate(['booking']);
  }

  onSendAppointmentEdit(appointmentId: string) {
    this.dialog.open(DialogSendEditRequest, {
      panelClass: 'send-edit-request-dialog',
      data: {
        appointmentId: appointmentId,
      },
    });
  }
  onInfoChange(appointmentId: string) {
    this.dialog.open(DialogShowChangeDetails, {
      panelClass: 'show-change-details-dialog',
      data: {
        appointmentId: appointmentId,
      },
    });
  }
  getSessionTypeLabel(value?: string): string {
    const map: Record<string, string> = {
      individualSession: this.translate.t('show-info.individualSession'),
      couplesSession: this.translate.t('show-info.couplesSession'),
      childrensSession: this.translate.t('show-info.childrensSession'),
      teenagersSession: this.translate.t('show-info.teenagersSession'),
      
    };
    return map[value || ''] || this.translate.t('show-info.notSpecified');
  }
}
