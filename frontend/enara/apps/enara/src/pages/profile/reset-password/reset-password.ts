import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResetPasswordService } from '../../../sevices/reset-password-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Translation } from '../../../../src/sevices/translation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export default class ResetPassword {
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
    translate = inject(Translation);
  
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  private resetPasswordService = inject(ResetPasswordService);
 
  onChangePass() {
      this.resetPasswordService.onChangePass(
        this.newPassword,
        this.oldPassword,
      );
  }

  showNewPassword = false;
  showOldPassword = false;
  showConfirmPassword = false;
  togglePasswordVisibility(type: 'new' | 'old' | 'confirm') {
  if (type === 'new') {
    this.showNewPassword = !this.showNewPassword;
  } else if (type === 'old') {
    this.showOldPassword = !this.showOldPassword;
  } else {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
 getPasswordStrengthText() {
  if (this.newPassword.length < 8) return 'ضعيفة';
  if (!/[A-Z]/.test(this.newPassword)) return 'متوسطة';
  if (!/\d/.test(this.newPassword)) return 'جيدة';
  return 'قوية';
}

getPasswordStrengthClass() {
  if (this.newPassword.length < 8) return 'weak';
  if (!/[A-Z]/.test(this.newPassword)) return 'medium';
  return 'strong';
}
}
