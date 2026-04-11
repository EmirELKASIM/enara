import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-doctor-start-meeting',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatError,
    MatIcon,
    MatLabel,
    MatFormField,
  ],
  templateUrl: './dialog-doctor-start-meeting.html',
  styleUrl: './dialog-doctor-start-meeting.css',
})
export default class DialogDoctorStartMeeting {
  public setActive = '';
  meetingUrl = '';
  data = inject(MAT_DIALOG_DATA);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  translate = inject(Translation);

  private startMeetingLink = `${apiUrl}/booking/meeting-active`;
  private toastr = inject(ToastrService);
  appointmentId = this.data.appointmentId;
  patientFirstName = this.data.patientFirstName;
  patientLastName = this.data.patientLastName;
  appointmentDate = this.data.appointmentDate;
  appointmentTime = this.data.appointmentTime;
  appointmentDuration = this.data.appointmentDuration;
  isSubmitting = false;
  onSetActiveChange(value: string) {
    this.setActive = value;
  }

  async onActiveMeeting() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const data = {
      appointmentId: this.appointmentId,
      meetingUrl: this.meetingUrl,
    };
    this.isSubmitting = true;

    this.http
      .put(this.startMeetingLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.meeting_ready"));
          this.isSubmitting = false;
        },
        error: (err) => this.toastr.error(this.translate.t("toastr.error_occurred")),
      });
  }
}
