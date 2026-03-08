import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import DialogRequests from '../doktor-file/dialog-requests/dialog-requests';
import { MatDialog } from '@angular/material/dialog';
import { apiUrl } from '../../constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../sevices/auth-db';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { Router } from '@angular/router';
import { SearchPipe } from '../../pipes/search-pipe';
import DialogDeleteRequest from './dialog-delete-request/dialog-delete-request';
import { MatBadgeModule } from '@angular/material/badge';
import { Translation } from '../../sevices/translation';
import { RequestInfo } from './IRequestInfo';

@Component({
  selector: 'app-doktor-file',
  imports: [
    FormsModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    SearchPipe,
    MatBadgeModule,
  ],
  templateUrl: './doktor-file.html',
  styleUrl: './doktor-file.css',
})
export default class DoktorFile {
  requestsInfo = signal<RequestInfo[]>([]);
  requestsInfoBadge = signal<RequestInfo[]>([]);
  readonly dialog = inject(MatDialog);
  public auth = inject(AuthService);
  private router = inject(Router);
  private acceptedRequestsLink = `${apiUrl}/request/accepted`;
  private http = inject(HttpClient);
  private getRequestLink = `${apiUrl}/request/info`;
  computedBadge = computed(() => this.requestsInfoBadge().length ?? '-');
  translate = inject(Translation);

  search = '';
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.acceptedRequestsLink, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.requestsInfo.set(res.token);;
          },
          error: (err) => {
            console.log('error', err.error.token);
          },
        });
    });
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
            this.requestsInfoBadge.set(res.token);
          },
          error: (err) => {
            console.log('error', err.error.token);
          },
        });
    });
  }
 
  showRequests() {
    this.dialog.open(DialogRequests, {
      panelClass: 'requests-dialog',
    });
  }
  onAcceptedRequest(requestId: string, patientId: string) {
    this.router.navigate(['/notes', requestId, patientId]);
  }

  onRequestDeleted(requestId: string, patientId: string) {
    const dialogRef = this.dialog.open(DialogDeleteRequest, {
      panelClass: 'delete-meeting-dialog',
      data: {
        requestId: requestId,
        patientId: patientId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.removeFromUI(requestId);
      }
    });
  }

  removeFromUI(requestId: string) {
    this.requestsInfo.update((items) =>
      items.filter((item) => item._id !== requestId),
    );
  }
}
