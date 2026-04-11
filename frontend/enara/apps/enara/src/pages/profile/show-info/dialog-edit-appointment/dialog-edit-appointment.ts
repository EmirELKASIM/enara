import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { apiUrl } from '../../../../../src/constants/constants';
import { AuthService } from '../../../../../src/sevices/auth-db';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatMenu } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { Translation } from '../../../../../src/sevices/translation';
import { GetAppointmentParams } from './IGetAppointmentParams';

@Component({
  selector: 'app-dialog-edit-appointment',
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    MatSelect,
    MatMenu,
    MatProgressSpinner,
    MatDialogContent,
    MatNativeDateModule,
    MatDialogActions,
    MatLabel,
    MatFormField,
    MatOption,
    MatIcon,
    MatDatepicker,
    MatDatepickerToggle,MatDialogModule
  ],
  templateUrl: './dialog-edit-appointment.html',
  styleUrl: './dialog-edit-appointment.css',
})
export default class DialogEditAppointment {
  appointmentInfo = signal<GetAppointmentParams[]>([]);
  private getAppointment = `${apiUrl}/appointment/info`;
  private updateBooking = `${apiUrl}/booking/update`;
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  data = inject(MAT_DIALOG_DATA);
  bookingId = this.data.bookingId;
  private dialogRef = inject(MatDialogRef<DialogEditAppointment>);
  translate = inject(Translation);

  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.getAppointment, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.appointmentInfo.set(res.token);
          },
          error: (err) => console.log(err),
        });
    });
  }

  async onEdit(newAppointmentId:string, newDate:string, newDay:string,newTime:string, newDuration:string) {
    
    const data = {
      newAppointmentId:newAppointmentId,
      bookingId:this.bookingId,
      newDate:newDate,
      newDay:newDay,
      newTime:newTime,
      newDuration:newDuration
    } 
    
 
    
    
    const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
    this.http.put(this.updateBooking,data,{
      headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
    }).subscribe({
      next:()=>{
        this.toastr.success(this.translate.t("toastr.updated_successfully"));
        this.dialogRef.close();
      },
      error:()=> {
        this.toastr.error(this.translate.t('toastr.something_went_wrong'));
      }
    })
  }
}
