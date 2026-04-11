import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Appointment } from '../../../../sevices/appointment';
import { Translation } from '../../../../../src/sevices/translation';
@Component({
  selector: 'app-dialog-delete-appointment',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-delete-appointment.html',
  styleUrl: './dialog-delete-appointment.css',
})
export default class DialogDeleteAppointment {
  private dialogRef = inject(MatDialogRef<DialogDeleteAppointment>);
  data = inject(MAT_DIALOG_DATA);
  private appointmentService = inject(Appointment);
  appointmentTime = this.data.appointmentTime;
  appointmentDate = this.data.appointmentDate;
  appointmentDuration = this.data.appointmentDuration;
  translate = inject(Translation);

  onDelete() {
    this.appointmentService.onDeleteAppointment(
      this.appointmentTime,
      this.appointmentDate,
      this.dialogRef,
    );
  }
}
