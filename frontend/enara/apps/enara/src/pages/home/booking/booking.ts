import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import DialogBookIt from './dialog-book-it/dialog-book-it';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { apiUrl } from '../../../constants/constants';
import DialogSendRequests from './dialog-send-requests/dialog-send-requests';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { Translation } from '../../../../src/sevices/translation';
import { Appointment } from './IAppointments-dates';
import { BookingSearchPipe } from '../../../../src/pipes/booking-search-pipe';
@Component({
  selector: 'app-booking',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCard,
    MatMenu,
    MatMenuTrigger,
    MatIcon,
    MatCardTitle,
    HttpClientModule,
    BookingSearchPipe,
  ],
  templateUrl: './booking.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './booking.css',
})
export default class Booking implements OnInit {
  dateValue!: Date;
  timeValue!: Date;
  searchQuery = '';
  readonly dialog = inject(MatDialog);
  translate = inject(Translation);
  hours: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes: number[] = Array.from({ length: 60 }, (_, i) => i);
  selectedHour = 1;
  selectedMinute = 0;
  period = 'AM';
  filteredDoctors: any[] = [];
  filteredDates: any[] = [];
  dates = signal<Appointment[]>([]);
  private allAppointmentsApi = `${apiUrl}/appointment/all-info`;
  timeSelected = false;
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadDates();
  }
  loadDates() {
    this.http
      .get(this.allAppointmentsApi, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
      .subscribe({
        next: (res: any) => {
          this.dates.set(res.token);
        },
        error: (err) => console.log(err),
      });
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    const dateStr = this.dateValue ? this.formatDate(this.dateValue) : null;
    const timeStr = this.timeValue ? this.formatTime(this.timeValue) : null;

    const doctorsData = this.dates();

    this.filteredDoctors = doctorsData
      .map((doctor) => {
        const filteredSlots = doctor.times.filter((slot: any) => {
          const matchesDate = dateStr ? doctor.date === dateStr : true;
          const matchesTime = timeStr ? slot.time === timeStr : true;
          return matchesDate && matchesTime && !slot.unavailable;
        });

        const matchesName = query
          ? (doctor.firstName + ' ' + doctor.lastName)
              .toLowerCase()
              .includes(query)
          : true;

        if (filteredSlots.length > 0 && matchesName) {
          return { ...doctor, slots: filteredSlots };
        }

        return null;
      })
      .filter((doctor) => doctor !== null);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  formatTime(time: any): string {
    if (!time) return '';

    let hours: number;
    let minutes: number;

    if (time instanceof Date) {
      hours = time.getHours();
      minutes = time.getMinutes();
    } else if (typeof time === 'string') {
      const [h, m] = time.split(':');
      hours = parseInt(h);
      minutes = parseInt(m);
    } else {
      return '';
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  onBookItDialog(
    appointmentId: string,
    firstName: string,
    lastName: string,
    time: string,
    date: string,
    day: string,
    drAccountType: string,
    doctorId: string,
    price: string,
    coinType: string,
    duration:string
  ) {
    const dialogRef = this.dialog.open(DialogBookIt, {
      panelClass: 'booking-appointment-dialog',
      data: {
        appointmentId: appointmentId,
        doctorFirstName: firstName,
        doctorLastName: lastName,
        appointmentTime: time,
        appointmentDate: date,
        appointmentDay: day,
        doctorAccountType: drAccountType,
        doctorId: doctorId,
        price: price,
        coinType: coinType,
        duration:duration
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.booked) {
        const doctors = this.filteredDoctors.map((doc) => {
          if (doc.firstName === firstName && doc.lastName === lastName) {
            const updatedSlots = doc.slots.map((slot: any) => {
              if (slot.time === time) {
                return { ...slot, status: 'booked' };
              }
              return slot;
            });
            return { ...doc, slots: updatedSlots };
          }
          return doc;
        });
        this.filteredDoctors = doctors;
      }
    });
  }
  onRequestDialog(
    doctorId: string,
    doctorFirstName: string,
    doctorLastName: string,
  ) {
    this.dialog.open(DialogSendRequests, {
      panelClass: 'request-send-dialog',
      data: {
        doctorId: doctorId,
        doctorFirstName: doctorFirstName,
        doctorLastName: doctorLastName,
      },
    });
  }
  getDaysLabel(value?: string): string {
    const map: Record<string, string> = {
      Monday: this.translate.t('booking-page.monday'),
      Tuesday: this.translate.t('booking-page.tuesday'),
      Wednesday: this.translate.t('booking-page.wednesday'),
      Thursday: this.translate.t('booking-page.thursday'),
      Friday: this.translate.t('booking-page.friday'),
      Saturday: this.translate.t('booking-page.saturday'),
      Sunday: this.translate.t('booking-page.sunday'),
    };
    return map[value || ''] || this.translate.t('booking-page.notSpecified');
  }
}
