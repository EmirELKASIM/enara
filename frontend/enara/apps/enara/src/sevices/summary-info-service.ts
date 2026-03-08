import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiUrl } from '../constants/constants';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class SummaryInfoService {
  private http = inject(HttpClient);
  private updateSummaryLink = `${apiUrl}/summary/update`;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  translate = inject(Translation);

  onSummaryUpdate(id: string, psychologicalSummary: string) {
    const data = {
      userId: id,
      psychologicalSummary: psychologicalSummary,
    };
    this.http
      .put(this.updateSummaryLink, data, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
      .subscribe({
        next: () => {
          this.toastr.success(this.translate.t('toastr.updated_successfully'));
          this.router.navigate(['']);
        },
        error: (err) => {
         this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
}
