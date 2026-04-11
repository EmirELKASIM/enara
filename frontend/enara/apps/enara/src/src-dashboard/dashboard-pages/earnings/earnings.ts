import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { apiUrl, header } from '../../../constants/constants';
import { FormsModule } from '@angular/forms';
import { AllBookings, DoctorEarnings } from './IAllBookings';
import { SearchDoctorNamePipe } from '../../../pipes/dashboard-pipes/search-doctor-name-pipe';

@Component({
  selector: 'app-earnings',
  imports: [FormsModule, SearchDoctorNamePipe],
  templateUrl: './earnings.html',
  styleUrl: './earnings.css',
})
export default class Earnings {
  searchDoctor = '';
  bookings = signal<AllBookings[]>([]);
  selectedMonth = signal<string>(this.getCurrentMonth());
  private http = inject(HttpClient);
  private getAllBookings = `${apiUrl}/booking/dashboard/all-bookings`;

  constructor() {
    effect(() => {
      this.http.get(this.getAllBookings, header).subscribe({
        next: (res: any) => this.bookings.set(res.token),
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
    return this.bookings().filter(
      (b) =>
        b.status === 'completed' &&
        b.paymentStatus === true &&
        (!this.selectedMonth() || b.createdAt.startsWith(this.selectedMonth())),
    );
  });
  getTotalCompletedSessions() {
    return this.filteredBookings().length;
  }
  
  groupedByDoctor = computed<DoctorEarnings[]>(() => {
    const grouped: Record<string, DoctorEarnings> = {};

    this.filteredBookings().forEach((b) => {
      const doctorName = `${b.doctorFirstName} ${b.doctorLastName}`;

      if (!grouped[doctorName]) {
        grouped[doctorName] = {
          doctorName,
          bookings: [],
          completedCount: 0,
        };
      }

      grouped[doctorName].bookings.push(b);
      grouped[doctorName].completedCount++;
    });

    return Object.values(grouped);
  });
}
