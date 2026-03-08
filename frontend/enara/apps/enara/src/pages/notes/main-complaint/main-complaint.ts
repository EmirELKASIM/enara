import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {  HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Translation } from '../../../../src/sevices/translation';
import { MainComplaintParams } from './IMainComplaintParams';



@Component({
  selector: 'app-main-complaint',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatOptionModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    HttpClientModule,
  ],
  templateUrl: './main-complaint.html',
  styleUrl: './main-complaint.css',
})
export default class MainComplaint  {
  readonly dialog = inject(MatDialog);
 

  complaint = '';
  complaintDuration = '';
  complaintSeverity = '';
  translate = inject(Translation);
  @Input({ required: true }) patientId!: string;
  @Output() mainComplaint = new EventEmitter<MainComplaintParams>();

 

  emitComplaint(value: string) {
    this.complaint = value;
    this.emit();
  }

  emitComplaintDuration(value: string) {
    this.complaintDuration = value;
    this.emit();
  }

  emitComplaintSeverity(value: string) {
    this.complaintSeverity = value;
    this.emit();
  }

  private emit() {
    this.mainComplaint.emit({
      complaint: this.complaint,
      complaintDuration: this.complaintDuration,
      complaintSeverity: this.complaintSeverity,
    });
  }
  
}
