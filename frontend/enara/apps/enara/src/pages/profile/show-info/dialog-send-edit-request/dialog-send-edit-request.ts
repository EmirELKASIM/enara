import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatHint, MatLabel } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { apiUrl } from '../../../../../src/constants/constants';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-send-edit-request',
  imports: [
    FormsModule,
    MatLabel,
    MatFormField,
    MatDatepicker,
    MatProgressSpinner,
    MatDialogClose,
    MatDialogActions,
    MatHint,
    MatIcon,
    MatDatepickerToggle,
    MatDialogContent,
  ],
  templateUrl: './dialog-send-edit-request.html',
  styleUrl: './dialog-send-edit-request.css',
})
export default class DialogSendEditRequest {
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  changeDetails = '';
  private auth = inject(AuthService);
  private changeAppointmentLink = `${apiUrl}/booking/change`;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
    translate = inject(Translation);
  
  isSubmitting = false;
  async onSendDatials() {
    this.isSubmitting = true;
    const data = {
      appointmentId: this.appointmentId,
      changeDetails: this.changeDetails,
    };
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .put(this.changeAppointmentLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.sent_successfully"));
          this.isSubmitting = false;
        },
        error: (err) => {
         this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
