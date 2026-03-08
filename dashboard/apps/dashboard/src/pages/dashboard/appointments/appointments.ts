import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { apiUrl, header } from '../../../../src/constants/constants';
import { AllAppointments } from './IAllAppointments';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../../src/pipes/search-pipe';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule, SearchPipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export default class Appointments {
  searchAppointment = '';
  appointments = signal<AllAppointments[]>([]);
  selectedMonth = signal<string>(this.getCurrentMonth());
  private http = inject(HttpClient);
  private getAllAppointmentsLink = `${apiUrl}/appointment/dashboard/all-appointments`;
  constructor() {
    effect(() => {
      this.http.get(this.getAllAppointmentsLink, header).subscribe({
        next: (res: any) => {
          this.appointments.set(res.token);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }
   getCurrentMonth(): string {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  }

  onMonthChange(event: any) {
    this.selectedMonth.set(event.target.value);
  }

  // فلترة حسب الشهر
  filteredAppointments = computed(() => {
    if (!this.selectedMonth()) return this.appointments();

    return this.appointments()
      .map((doctor) => {
        const filteredTimes = doctor.times.filter((time: any) =>
          doctor.createdAt.startsWith(this.selectedMonth())
        );
        return { ...doctor, times: filteredTimes };
      })
      .filter((doctor) => doctor.times.length > 0);
  });

  // إحصائيات المواعيد المحجوزة والمتاحة
  getAppointmentsStats() {
    let booked = 0;
    let available = 0;

    this.filteredAppointments().forEach((doctor) => {
      doctor.times.forEach((time) => {
        if (time.status === 'booked') booked++;
        else available++;
      });
    });

    return { booked, available };
  }
}
