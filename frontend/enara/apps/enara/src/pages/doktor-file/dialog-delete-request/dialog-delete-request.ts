import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { apiUrl } from '../../../../src/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-delete-request',
  imports: [MatButtonModule, MatDialogModule, HttpClientModule],
  templateUrl: './dialog-delete-request.html',
  styleUrl: './dialog-delete-request.css',
})
export default class DialogDeleteRequest {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  data = inject(MAT_DIALOG_DATA);
  requestId = this.data.requestId;
  patientId = this.data.patientId;
  private dialogRef = inject(MatDialogRef<DialogDeleteRequest>);
  translate = inject(Translation);

  onRequestDeleted() {
    const url = `${apiUrl}/request/delete/${this.requestId}/${this.patientId}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.toastr.success(this.translate.t("toastr.file_deleted"));
        this.dialogRef.close('confirm');
      },
      error: ()=>{
        this.toastr.error(this.translate.t("toastr.failed_file_deleted"))
      }
    });
  }
}
