import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../sevices/auth-db';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Translation } from '../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-logout',
  imports: [MatButtonModule, MatDialogModule,MatProgressSpinnerModule, FormsModule],
  templateUrl: './dialog-logout.html',
  styleUrl: './dialog-logout.css',
})
export default class DialogLogout {
  public auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
    translate = inject(Translation);
  
  onLogout() {
    this.auth.logout();
    this.toastr.success(this.translate.t("toastr.logged_out_successfully"));
    this.router.navigate(['']);
  }
 
}
