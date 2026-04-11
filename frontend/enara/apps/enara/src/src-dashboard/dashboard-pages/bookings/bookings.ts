import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { apiUrl, header } from '../../../constants/constants';
import { AllBookings, DoctorBookingGroup } from './IAllBookings';
import { FormsModule } from '@angular/forms';
import { SearchDoctorNamePipe } from '../../../pipes/dashboard-pipes/search-doctor-name-pipe';

@Component({
  selector: 'app-bookings',
  imports: [FormsModule, SearchDoctorNamePipe],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export default class Bookings {
  searchDoctor = '';
  bookings = signal<AllBookings[]>([]);
  selectedMonth = signal<string>(this.getCurrentMonth());
  private http = inject(HttpClient);
  private getAllBookings = `${apiUrl}/booking/dashboard/all-bookings`;

  constructor() {
    effect(() => {
      this.http.get(this.getAllBookings, header).subscribe({
        next: (res: any) => {
          this.bookings.set(res.token);
        },
        error: (err) => console.log(err),
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

  
  filteredBookings = computed(() => {
    if (!this.selectedMonth()) return this.bookings();

    return this.bookings().filter((booking) =>
      booking.createdAt.startsWith(this.selectedMonth()),
    );
  });

  
  groupedByDoctor = computed<DoctorBookingGroup[]>(() => {
    const grouped: Record<string, DoctorBookingGroup> = {};

    this.filteredBookings().forEach((b) => {
      const doctorName = `${b.doctorFirstName} ${b.doctorLastName}`;

      if (!grouped[doctorName]) {
        grouped[doctorName] = {
          doctorName,
          booked: 0,
          attendance: 0,
          completed: 0,
          canceled: 0,
          bookings: [],
        };
      }

      grouped[doctorName].bookings.push(b);

      switch (b.status) {
        case 'booked':
          grouped[doctorName].booked++;
          break;
        case 'attendance':
          grouped[doctorName].attendance++;
          break;
        case 'completed':
          grouped[doctorName].completed++;
          break;
        case 'canceled':
          grouped[doctorName].canceled++;
          break;
      }
    });

    return Object.values(grouped);
  });
  getTotalStats() {
    let booked = 0;
    let attendance = 0;
    let completed = 0;
    let canceled = 0;

    this.filteredBookings().forEach((b) => {
      switch (b.status) {
        case 'booked':
          booked++;
          break;
        case 'attendance':
          attendance++;
          break;
        case 'completed':
          completed++;
          break;
        case 'canceled':
          canceled++;
          break;
      }
    });

    return { booked, attendance, completed, canceled };
  }
}
