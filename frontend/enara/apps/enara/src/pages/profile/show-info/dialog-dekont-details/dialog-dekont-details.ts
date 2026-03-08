import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { apiUrl } from '../../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../../src/sevices/translation';
import { bookingInfo } from './IBookingInfo';

@Component({
  selector: 'app-dialog-dekont-details',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialog-dekont-details.html',
  styleUrl: './dialog-dekont-details.css',
})
export default class DialogDekontDetails {
  bookingInfo = signal<bookingInfo | null>(null);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  patientId = this.data.patientId;
  private getDekontLink = `${apiUrl}/booking/dekont-details/${this.appointmentId}/${this.patientId}`;
  private acceptedDekontLink = `${apiUrl}/booking/accept-dekont`;
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);
  translate = inject(Translation);

  dekontCode = computed(() => this.bookingInfo()?.dekontCode ?? null);
  dekontNotes = computed(() => this.bookingInfo()?.dekontNotes ?? null);
  paymentStatus = computed(() => this.bookingInfo()?.paymentStatus ?? false);
  private dialogRef = inject(MatDialogRef<DialogDekontDetails>);
  inValidDekontCode = computed(() => this.dekontCode() === "");
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.getDekontLink, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.bookingInfo.set(res.token);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }

  async onAccepted() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const data = {
      appointmentId: this.appointmentId,
      patientId: this.patientId,
    };
    this.http
      .put(this.acceptedDekontLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.appointment_confirmed"));
          this.dialogRef.close({
            paymentStatus: this.paymentStatus(),
          });
        },
        error: () => this.toastr.error(this.translate.t('toastr.something_went_wrong')),
      });
  }
}
