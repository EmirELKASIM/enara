import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { bookedAppointmentsInfo, UserInfo } from './IUserInfo';
import { AuthService } from '../../sevices/auth-db';
import { apiUrl } from '../../constants/constants';
import DialogPayment from '../profile/show-info/dialog-payment/dialog-payment';
import { MatDialog } from '@angular/material/dialog';
import DialogDoctorStartMeeting from '../profile/show-info/dialog-doctor-start-meeting/dialog-doctor-start-meeting';
import DialogUserStartMeeting from '../profile/show-info/dialog-user-start-meeting/dialog-user-start-meeting';
import DialogEditAppointment from '../profile/show-info/dialog-edit-appointment/dialog-edit-appointment';
import DialogSendEditRequest from '../profile/show-info/dialog-send-edit-request/dialog-send-edit-request';
import DialogDekontDetails from '../profile/show-info/dialog-dekont-details/dialog-dekont-details';
import DialogShowChangeDetails from '../profile/show-info/dialog-show-change-details/dialog-show-change-details';
import { Translation } from '../../sevices/translation';

@Component({
  selector: 'app-sessions',
  imports: [],
  templateUrl: './sessions.html',
  styleUrl: './sessions.css',
})
export default class Sessions {
  info = signal<UserInfo | null>(null);
  appointmentsInfo = signal<bookedAppointmentsInfo[] | null>(null);

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private profileApi = `${apiUrl}/user/info`;
  private bookingAppointmentsForUserApi = `${apiUrl}/booking/user-info`;
  private bookingAppointmentsForDoctorApi = `${apiUrl}/booking/doctor-info`;
  private appointmentsCancelLink = `${apiUrl}/booking/cancel`;
  private toastr = inject(ToastrService);
  accountType = computed(() => this.info()?.accountType ?? '-');
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);

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
          next: (res) => this.info.set(res),
          error: (err) => console.log(err.error?.token),
        });
    });
    effect(async () => {
      if (!this.info()) return;
      if (this.isPersonal()) {
        const token = await this.auth.getToken();
        if (!token) throw new Error('Token not found');
        this.http
          .get<bookedAppointmentsInfo>(this.bookingAppointmentsForUserApi, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .subscribe({
            next: (res: any) => this.appointmentsInfo.set(res.token),

            error: (err) => console.log(err.error?.token),
            
          });
      } else {
        const token = await this.auth.getToken();
        if (!token) throw new Error('Token not found');
        this.http
          .get<bookedAppointmentsInfo>(this.bookingAppointmentsForDoctorApi, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .subscribe({
            next: (res: any) => this.appointmentsInfo.set(res.token),

            error: (err) => console.log(err.error?.token),
            
          });
      }
    });
  }
  async onAppoitmentCanceled(
    appointmentId: string,
    appointmentDate: string,
    appointmentTime: string,
    doctorId: string,
  ) {
    const data = {
      appointmentId: appointmentId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      doctorId: doctorId,
    };
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const headers = {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    };
    this.http.put(this.appointmentsCancelLink, data, { headers }).subscribe({
      next: () => {
        this.toastr.success(this.translate.t("toastr.appointment_successfully_canceled"));

        this.appointmentsInfo.update((list) =>
          list ? list.filter((a: any) => a._id !== appointmentId) : list,
        );
      },
      error: () => this.toastr.error(this.translate.t("toastr.error_occurred")),
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
  onSendAppointmentEdit(appointmentId: string) {
    this.dialog.open(DialogSendEditRequest, {
      panelClass: 'send-edit-request-dialog',
      data: {
        appointmentId: appointmentId,
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

  onInfoChange(appointmentId: string) {
    this.dialog.open(DialogShowChangeDetails, {
      panelClass: 'show-change-details-dialog',
      data: {
        appointmentId: appointmentId,
      },
    });
  }
}
