import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { apiUrl } from '../../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { Translation } from '../../../../../src/sevices/translation';
import { bookedAppointmentsInfo } from './IBookedAppointmentsInfo';

@Component({
  selector: 'app-dialog-show-change-details',
  imports: [MatDialogActions, MatDialogContent,MatDialogModule],
  templateUrl: './dialog-show-change-details.html',
  styleUrl: './dialog-show-change-details.css',
})
export default class DialogShowChangeDetails {
  changeInfo = signal<bookedAppointmentsInfo | null>(null);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  private getBookingForDoctor = `${apiUrl}/booking/doctor-info`;
  private http = inject(HttpClient);
  private auth = inject(AuthService);
    translate = inject(Translation);
  
  computedChangeDetails = computed(
    () => (this.changeInfo()?.changeDetails?.trim()?.length ?? 0) > 0,
  );
computedChangeDetailsText = computed(() => {
  return this.changeInfo()?.changeDetails?.trim() ?? '';
});
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.getBookingForDoctor, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            const appointment = res.token.find((app:any) => app._id === this.appointmentId);
            this.changeInfo.set(appointment);
            
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }
}
