import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { apiUrl } from '../../../../../src/constants/constants';
import { MatButtonModule } from '@angular/material/button';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-delete-panel',
  imports: [MatButtonModule, MatDialogModule, HttpClientModule],
  templateUrl: './dialog-delete-panel.html',
  styleUrl: './dialog-delete-panel.css',
})
export default class DialogDeletePanel {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private dialogRef = inject(MatDialogRef<DialogDeletePanel>);
  data = inject(MAT_DIALOG_DATA);
  examinationId = this.data.examinationId;
  patientId = this.data.patientId;
  doctorId = this.data.doctorId;
  translate = inject(Translation);

  onDeletePanel() {
    const url = `${apiUrl}/examination/delete/${this.examinationId}/${this.patientId}/${this.doctorId}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.toastr.success(this.translate.t("toastr.preview_deleted"));
        this.dialogRef.close('confirm');
      },
      error: () => {
        this.toastr.error(this.translate.t('toastr.something_went_wrong'));
      },
    });
  }
}
