import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { apiUrl, header } from '../../../../src/constants/constants';
import { AllRequestsParams } from './IAllRequestsParams';

@Component({
  selector: 'app-examination-requests',
  imports: [],
  templateUrl: './examination-requests.html',
  styleUrl: './examination-requests.css',
})
export default class ExaminationRequests {
  requests = signal<AllRequestsParams[]>([]);
  private getAllRequests = `${apiUrl}/request/dashboard/all-requests`;
  private http = inject(HttpClient);
  requestsCount = computed(() => this.requests().length);

  constructor() {
    effect(() => {
      this.http.get(this.getAllRequests, header).subscribe({
        next: (res: any) => {
          this.requests.set(res.token);
          console.log(this.requests);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }
  groupDocumentsByDoctor() {
    const grouped: { [key: string]: any } = {};

    this.requests().forEach((doc) => {
      if (!grouped[doc.doctorId]) {
        grouped[doc.doctorId] = {
          doctorName: `${doc.doctorFirstName} ${doc.doctorLastName}`,
          count: 0,
          documents: [],
        };
      }

      grouped[doc.doctorId].count++;
      grouped[doc.doctorId].documents.push(doc);
    });

    Object.values(grouped).forEach((doctor) => {
      doctor.documents.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    });

    return Object.values(grouped);
  }
}
