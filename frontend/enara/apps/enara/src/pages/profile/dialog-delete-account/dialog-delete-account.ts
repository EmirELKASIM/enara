import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../sevices/auth-db';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../src/constants/constants';
import { Translation } from '../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-delete-account',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormField,
    MatError,
    MatHint,
    MatLabel,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './dialog-delete-account.html',
  styleUrl: './dialog-delete-account.css',
})
export default class DialogDeleteAccount  {
  public auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private deleteLink = `${apiUrl}/user/delete`;
  translate = inject(Translation);

  confirmDelete = false;


  async onDelete() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .delete(this.deleteLink, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.auth.logout(); // 🔥 مهم جدًا
          this.toastr.success(this.translate.t('toastr.deleted_successfully'));
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.failed_delete_account'));
        },
      });
  }
}
