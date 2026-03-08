import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth-db';
import { apiUrl } from '../constants/constants';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class Appointment {
  private http = inject(HttpClient);
  private deleteAppointmentLink = `${apiUrl}/appointment/delete-appointment`;
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  translate = inject(Translation);
  async onDeleteAppointment(
    appointmentTime: string,
    appointmentDate: string,
    dialogRef: any,
  ) {
    const token = await this.auth.getToken();
    if (!token) return;

    this.http
      .delete(this.deleteAppointmentLink, {
        body: {
          appointmentTime: appointmentTime,
          appointmentDate: appointmentDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.deleted_successfully'));
          dialogRef.close(true);
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
