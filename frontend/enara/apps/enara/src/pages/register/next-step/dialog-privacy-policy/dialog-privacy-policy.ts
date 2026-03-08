import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-dialog-privacy-policy',
  imports: [MatButtonModule, MatDialogModule,],
  templateUrl: './dialog-privacy-policy.html',
  styleUrl: './dialog-privacy-policy.css',
})
export default class DialogPrivacyPolicy {
  translate = inject(Translation);

}
