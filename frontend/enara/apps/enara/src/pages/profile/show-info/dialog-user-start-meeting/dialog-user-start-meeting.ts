import { Component, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { apiUrl } from '../../../../constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../sevices/auth-db';
import { MatIcon } from '@angular/material/icon';
import { Translation } from '../../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-user-start-meeting',
  imports: [MatButtonModule, MatDialogModule, HttpClientModule,MatIcon],
  templateUrl: './dialog-user-start-meeting.html',
  styleUrl: './dialog-user-start-meeting.css',
})
export default class DialogUserStartMeeting {
  public meetingLink = signal<{ meetingUrl: string } | null>(null);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  doctorFirstName = this.data.doctorFirstName;
  doctorLastName = this.data.doctorLastName;

  private toastr = inject(ToastrService);
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private startMeetingLink = `${apiUrl}/booking/meeting-active-info`;
  translate = inject(Translation);

  
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) return;

      this.http.post<{ meetingUrl: string }>(
        this.startMeetingLink,
        { appointmentId: this.appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      ).subscribe({
        next: (res: any) => {
          this.meetingLink.set(res.token);
        },
        error: (err) =>
          this.toastr.error(this.translate.t("toastr.error_occurred")),
      });
    });
  }
  startMeeting() {
    const url = this.meetingLink()?.meetingUrl;
    if (!url) return;
    window.open(url, '_blank');
  }
}
