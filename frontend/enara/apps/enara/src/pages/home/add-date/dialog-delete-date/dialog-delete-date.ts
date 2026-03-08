import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { apiUrl } from '../../../../../src/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-delete-date',
  imports: [MatButtonModule, MatDialogModule, HttpClientModule],
  templateUrl: './dialog-delete-date.html',
  styleUrl: './dialog-delete-date.css',
})
export default class DialogDeleteDate {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private deleteDateLink = `${apiUrl}/appointment/delete-date`;
  private toastr = inject(ToastrService);
  private dialogRef = inject(MatDialogRef<DialogDeleteDate>);
  data = inject(MAT_DIALOG_DATA);
  date = this.data.date;
  translate = inject(Translation);

  async onDeleteDate(): Promise<void> {
    const token = await this.auth.getToken();
    if (!token) return;

    this.http
      .delete(this.deleteDateLink, {
        body: { appointmentDate: this.date },
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.date_deleted'));
          this.dialogRef.close('confirm');
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.failed_delete_date'));
        },
      });
  }
}
