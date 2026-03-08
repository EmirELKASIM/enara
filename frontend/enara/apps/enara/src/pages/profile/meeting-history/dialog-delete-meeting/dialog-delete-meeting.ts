import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../src/sevices/auth-db';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { apiUrl } from '../../../../../src/constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-delete-meeting',
  imports: [MatButtonModule, MatDialogModule, HttpClientModule],
  templateUrl: './dialog-delete-meeting.html',
  styleUrl: './dialog-delete-meeting.css',
})
export default class DialogDeleteMeeting {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private dialogRef = inject(MatDialogRef<DialogDeleteMeeting>);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  isDoctor = this.data.isDoctor;
  translate = inject(Translation);

  private userDeleteApi = `${apiUrl}/booking/user-history-delete`;
  private doctorDeleteApi = `${apiUrl}/booking/doctor-history-delete`;
  async onDeleteItem() {
    const token = await this.auth.getToken();
    if (!token) return;
    const appointmentId = this.appointmentId;
    const url = this.isDoctor() ? this.doctorDeleteApi : this.userDeleteApi;

    this.http
      .put(
        url,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.appointment_deleted"));
          this.dialogRef.close('confirm');
        },
        error: () => this.toastr.error(this.translate.t("toastr.failed_delete_appointment")),
      });
  }
}
