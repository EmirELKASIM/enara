import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Translation } from '../../../../../src/sevices/translation';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dialog-info',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-info.html',
  styleUrl: './dialog-info.css',
})
export default class DialogInfo {
  private router = inject(Router);
  translate = inject(Translation);
  private dialogRef = inject(MatDialogRef<DialogInfo>);

  goToProfile() {
    this.router.navigate(["/profile"]);
    this.dialogRef.close();
  }
}
