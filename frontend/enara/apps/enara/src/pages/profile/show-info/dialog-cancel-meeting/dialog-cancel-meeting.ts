import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Translation } from '../../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-cancel-meeting',
  imports: [
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatError,
    MatHint,
    MatIcon,
    FormsModule,
    MatLabel,
    MatFormField
  ],
  templateUrl: './dialog-cancel-meeting.html',
  styleUrl: './dialog-cancel-meeting.css',
})
export default class DialogCancelMeeting {
  private auth = inject(AuthService);
  private appointmentsCancelLink = `${apiUrl}/booking/cancel`;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  appointmentDate = this.data.appointmentDate;
  appointmentTime = this.data.appointmentTime;
  doctorId = this.data.doctorId;
  isCanceling = false;
  translate = inject(Translation);

  private dialogRef = inject(MatDialogRef<DialogCancelMeeting>);
  async onAppoitmentCanceled() {
  this.isCanceling = true;

    const data = {
      appointmentId: this.appointmentId,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      doctorId: this.doctorId,
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
        this.dialogRef.close({
          canceled: true,
          appointmentId: this.appointmentId,
         

        });
         this.isCanceling = false;
      },
      error: (err) => this.toastr.error(this.translate.t("toastr.error_occurred")),
    });
  }
 
}
