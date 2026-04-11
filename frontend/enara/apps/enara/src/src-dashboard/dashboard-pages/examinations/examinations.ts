import { HttpClient } from '@angular/common/http';
import { Component, computed,  inject, signal } from '@angular/core';
import { apiUrl, header } from '../../../constants/constants';
import { AllExaminations, DoctorGroup } from './IAllExaminations';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchDoctorNamePipe } from '../../../pipes/dashboard-pipes/search-doctor-name-pipe';

@Component({
  selector: 'app-examinations',
  imports: [FormsModule, SearchDoctorNamePipe],
  templateUrl: './examinations.html',
  styleUrl: './examinations.css',
})
export default class Examinations {
  private http = inject(HttpClient);
  private router = inject(Router);
  searchDoctor = '';
  examinations = signal<AllExaminations[]>([]);
  selectedMonth = signal<string>(this.getCurrentMonth());

  constructor() {
    this.http
      .get(`${apiUrl}/examination/dashboard/all-info`, header)
      .subscribe((res: any) => {
        this.examinations.set(res.token);
      });
  }

  getCurrentMonth(): string {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  }

  onMonthChange(event: any) {
    this.selectedMonth.set(event.target.value);
  }

  filteredExaminations = computed(() => {
    return this.examinations().filter((exam) => {
      return exam.createdAt.startsWith(this.selectedMonth());
    });
  });

  totalFilteredCount = computed(() => this.filteredExaminations().length);

  groupedByDoctor = computed<DoctorGroup[]>(() => {
    const grouped: any = {};

    this.filteredExaminations().forEach((doc) => {
      if (!grouped[doc.doctorId]) {
        grouped[doc.doctorId] = {
          doctorId: doc.doctorId,
          doctorName: `${doc.doctorFirstName} ${doc.doctorLastName}`,
          count: 0,
          documents: [],
        };
      }

      grouped[doc.doctorId].count++;
      grouped[doc.doctorId].documents.push(doc);
    });

    return Object.values(grouped);
  });
  
}
