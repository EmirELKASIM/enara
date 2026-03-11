import { Component, inject } from '@angular/core';
import { apiUrl } from '../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Translation } from '../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-forgot-password',
  imports: [FormsModule,MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog-forgot-password.html',
  styleUrl: './dialog-forgot-password.css',
})
export default class DialogForgotPassword {
  private sendEmail = `${apiUrl}/user/forgot-password`;
  private http = inject(HttpClient);
  email = '';
  private toastr = inject(ToastrService);
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);

  async onSendEmail() {
    
    const data = {
      email: this.email,
    };
    this.http
      .post(this.sendEmail, data, {
        headers: {
          
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t("toastr.link_sent_to_email"));
          this.dialog.closeAll();
        },
        error: (err) => this.toastr.error(this.translate.t('toastr.something_went_wrong')),
      });
  }
}
