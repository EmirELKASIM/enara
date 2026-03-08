import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ToastrService } from 'ngx-toastr';

import DialogDeleteAppointment from './dialog-delete-appointment/dialog-delete-appointment';
import DialogInfo from './dialog-info/dialog-info';

import { AddDateService } from '../../../sevices/add-date-service';
import { AuthService } from '../../../sevices/auth-db';
import { apiUrl } from '../../../constants/constants';
import DialogDeleteDate from './dialog-delete-date/dialog-delete-date';
import { MatRadioModule } from '@angular/material/radio';
import { Translation } from '../../../../src/sevices/translation';
import { AppointmentDate, AppointmentTime } from './IAppointmentInfo';

@Component({
  selector: 'app-add-date',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatDialogModule,
    MatTooltipModule,
    DialogInfo,
    MatRadioModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-date.html',
  styleUrl: './add-date.css',
})
export default class AddDate implements OnInit {
  dateValue!: Date;
  timeValue!: Date;

  dates = signal<AppointmentDate[]>([]);

  isAdding = false;
  dateFocused = false;
  timeFocused = false;

  minDate: Date = new Date();
  coinType = '';
  price = '';
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private addDateService = inject(AddDateService);
  private auth = inject(AuthService);
  translate = inject(Translation);

  private addDateLink = `${apiUrl}/appointment/add`;
  ngOnInit(): void {
    this.loadDates();
  }

  formatDate(date: string): string {
    return date;
  }

  formatTime(time: string): string {
    return time;
  }

  emitCoinType(val: string) {
    this.coinType = val;
  }

  private formatTimeFromDate(time: Date): string {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }
  formatDateFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  loadDates(): void {
    this.addDateService.loadDates(this.dates);
  }

  async onAddDate(): Promise<void> {
    if (!this.dateValue || !this.timeValue) return;

    this.isAdding = true;

    const token = await this.auth.getToken();
    if (!token) return;
    const data = {
      date: this.formatDateFromDate(this.dateValue),
      time: this.formatTimeFromDate(this.timeValue),
      price: this.price,
      coinType: this.coinType,
    };

    this.http
      .post(this.addDateLink, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.appointment_added'));
          this.addTimeToUI(this.dateValue, this.timeValue);
          this.isAdding = false;
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.error_during_addition'));
          this.isAdding = false;
        },
      });
  }

  private addTimeToUI(date: Date, time: Date): void {
    this.addDateService.addTimeToUI(
      this.formatDateFromDate(date),
      this.formatTimeFromDate(time),
      this.dates,
      this.price,
      this.coinType,
    );
  }

  onDeleteDialog(time: string, date: string): void {
    const dialogRef = this.dialog.open(DialogDeleteAppointment, {
      panelClass: 'delete-appointment-dialog',
      data: {
        appointmentTime: time,
        appointmentDate: date,
      },
    });

    dialogRef.afterClosed().subscribe((deleted) => {
      if (!deleted) return;
      this.removeTimeFromUI(date, time);
    });
  }

  onDeleteDate(date: string) {
    const dialogRef = this.dialog.open(DialogDeleteDate, {
      panelClass: 'delete-date-dialog',
      data: {
        date: date,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.removeAllTimesFromUI(date);
      }
    });
  }

  private removeTimeFromUI(date: string, time: string): void {
    this.addDateService.removeTimeFromUI(date, time, this.dates);
  }

  private removeAllTimesFromUI(date: string): void {
    this.addDateService.removeAllTimesFromUI(date, this.dates);
  }

  isOneBooked(times: AppointmentTime[]): boolean {
    return times.some((t) => t.status === 'booked');
  }

  getBookedCount(times: AppointmentTime[]): number {
    return times.filter((t) => t.status === 'booked').length;
  }

  getAvailableCount(times: AppointmentTime[]): number {
    return times.filter((t) => t.status === 'available').length;
  }

  getBookingRate(): number {
    const all = this.dates().flatMap((d) => d.times);
    if (!all.length) return 0;

    return Math.round(
      (all.filter((t) => t.status === 'booked').length / all.length) * 100,
    );
  }

  scrollToForm(): void {
    document
      .querySelector('.add-date-layout')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  onInfoDialogOpen(): void {
    this.dialog.open(DialogInfo, { panelClass: 'info-dialog' });
  }

  getDaysLabel(value?: string): string {
    const map: Record<string, string> = {
      Monday: this.translate.t('add_date_page.monday'),
      Tuesday: this.translate.t('add_date_page.tuesday'),
      Wednesday: this.translate.t('add_date_page.wednesday'),
      Thursday: this.translate.t('add_date_page.thursday'),
      Friday: this.translate.t('add_date_page.friday'),
      Saturday: this.translate.t('add_date_page.saturday'),
      Sunday: this.translate.t('add_date_page.sunday'),
    };
    return map[value || ''] || this.translate.t('add_date_page.notSpecified');
  }
}
