import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Appointment } from '../../../../sevices/appointment';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import GeneralInfo from '../general-info/general-info';
import { Translation } from '../../../../../src/sevices/translation';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-dialog-book-it',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    GeneralInfo,
    MatIconModule
  ],
  templateUrl: './dialog-book-it.html',
  styleUrl: './dialog-book-it.css',
})
export default class DialogBookIt {
  meetingType = '';
  data = inject(MAT_DIALOG_DATA);
  appointmentId = this.data.appointmentId;
  doctorFirstName = this.data.doctorFirstName;
  doctorLastName = this.data.doctorLastName;
  appointmentTime = this.data.appointmentTime;
  appointmentDate = this.data.appointmentDate;
  appointmentDay = this.data.appointmentDay;
  doctorAccountType = this.data.doctorAccountType;
  doctorId = this.data.doctorId;
  appointmentPrice = this.data.price;
  appointmentCoinType = this.data.coinType;
  appointmentDuration = this.data.duration;
  private router = inject(Router);

  translate = inject(Translation);

  private auth = inject(AuthService);

  private toastr = inject(ToastrService);
  private bookingAddLink = `${apiUrl}/booking/add`;

  private http = inject(HttpClient);
  onMeetingTypeChanged(value: string) {
    this.meetingType = value;
  }
  reportInfo!: any;
  onAcceptedInfo(data: any) {
    this.reportInfo = data;
  }
  isTrue = false;

  onIsTrue(val: boolean) {
    this.isTrue = val;
  }

  paymentMethod = '';

  async onPayment() {
    if (this.paymentMethod === 'creditCard') {
      const bookingData = {
        appointmentId: this.appointmentId,
        doctorId: this.doctorId,
        doctorFirstName: this.doctorFirstName,
        doctorLastName: this.doctorLastName,
        doctorAccountType: this.doctorAccountType,
        appointmentTime: this.appointmentTime,
        appointmentDate: this.appointmentDate,
        appointmentDay: this.appointmentDay,
        meetingType: this.meetingType,
        reportInfo: this.reportInfo,
        appointmentPrice: this.appointmentPrice,
        appointmentCoinType: this.appointmentCoinType,
        appointmentDuration: this.appointmentDuration,
      };

      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      this.router.navigate(['payment-iyzico']);
    } else if (this.paymentMethod === 'manualDekont') {
      const data = {
        appointmentId: this.appointmentId,
        appointmentTime: this.appointmentTime,
        appointmentDate: this.appointmentDate,
        appointmentDay: this.appointmentDay,
        doctorFirstName: this.doctorFirstName,
        doctorLastName: this.doctorLastName,
        doctorAccountType: this.doctorAccountType,
        doctorId: this.doctorId,
        meetingType: this.meetingType,
        reportInfo: this.reportInfo,
        appointmentPrice: this.appointmentPrice,
        appointmentCoinType: this.appointmentCoinType,
        appointmentDuration: this.appointmentDuration,
      };
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .post(this.bookingAddLink, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: () => {
            this.toastr.success(this.translate.t('toastr.appointment_booked'));
          },
          error: (err) => {
            this.toastr.error(this.translate.t('toastr.something_went_wrong'));
          },
        });
    } else {
      return;
    }
  }
}
