import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { apiUrl } from '../../../constants/constants';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../sevices/auth-db';
import { MatDivider } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../src/sevices/translation';
import { RequestInfo } from './IRequestInfo';

@Component({
  selector: 'app-dialog-requests',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatDivider,
  ],
  templateUrl: './dialog-requests.html',
  styleUrl: './dialog-requests.css',
})
export default class DialogRequests {
  requestsInfo = signal<RequestInfo[]>([]);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);
  translate = inject(Translation);
  private updateRequestLink = `${apiUrl}/request/update`;
  private getRequestLink = `${apiUrl}/request/info`;
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.getRequestLink, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.requestsInfo.set(res.token);
          },
          error: (err) => {
            console.log('error', err.error.token);
          },
        });
    });
  }
  onBlockRequest(requestId: string) {
    const data = {
      requestId: requestId,
      acceptedFromDoctor: false,
    };

    this.http.put(this.updateRequestLink, data).subscribe({
      next: (res) => {
        this.toastr.success(this.translate.t('toastr.successfully_rejected'));
        this.requestsInfo.update((list) =>
          list.filter((req) => req._id !== requestId),
        );
      },
      error: (err) => {
       this.toastr.error(this.translate.t('toastr.something_went_wrong'));
      },
    });
  }
  onAcceptedRequest(requestId: string) {
    const data = {
      requestId: requestId,
      acceptedFromDoctor: true,
    };

    this.http.put(this.updateRequestLink, data).subscribe({
      next: (res) => {
        this.toastr.success(this.translate.t('toastr.request_accepted'));
        this.requestsInfo.update((list) =>
          list.filter((req) => req._id !== requestId),
        );
      },
      error: (err) => {
        this.toastr.error(this.translate.t('toastr.something_went_wrong'));
      },
    });
  }
}
