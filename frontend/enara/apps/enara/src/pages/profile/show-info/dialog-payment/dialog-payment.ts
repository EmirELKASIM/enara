import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { apiUrl } from '../../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-payment',
  imports: [FormsModule,MatDialogModule,MatButtonModule,MatFormFieldModule,  // ✅
    MatInputModule, ],
  templateUrl: './dialog-payment.html',
  styleUrl: './dialog-payment.css',
})
export default class DialogPayment {
  private dialogRef = inject(MatDialogRef<DialogPayment>);
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  appointmentDate = this.data.appointmentDate;
  appointmentTime = this.data.appointmentTime;
  appointmentPrice = this.data.appointmentPrice;
  appointmentCoinType = this.data.appointmentCoinType;
  private sendDekontLink = `${apiUrl}/booking/dekont`;
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);
    translate = inject(Translation);
  
  dekontCode= '';
  dekontNotes = '';
  async onSendDekont() {
    const data = {
      appointmentId: this.appointmentId,
      dekontCode: this.dekontCode,
      dekontNotes: this.dekontNotes,
    };

    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .put(this.sendDekontLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.sent_successfully"));
          this.dialogRef.close();          
        },
        error: () => this.toastr.error(this.translate.t('toastr.something_went_wrong')),
      });
  }
}
