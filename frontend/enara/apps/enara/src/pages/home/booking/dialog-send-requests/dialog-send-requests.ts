import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../constants/constants';
import { AuthService } from '../../../../sevices/auth-db';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Translation } from '../../../../../src/sevices/translation';
import { RequestDataParams, UserInfoParams } from './IRequestDataParams';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-send-requests',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog-send-requests.html',
  styleUrl: './dialog-send-requests.css',
})
export default class DialogSendRequests {
  requestData = signal<RequestDataParams | null>(null);
  userInfo = signal<UserInfoParams | null>(null);

  data = inject(MAT_DIALOG_DATA);
  doctorId = this.data.doctorId;
  doctorFirstName = this.data.doctorFirstName;
  doctorLastName = this.data.doctorLastName;
  translate = inject(Translation);
  private requestAcceptedLink = `${apiUrl}/request/linked/${this.doctorId}`;
  private userInfoLink = `${apiUrl}/user/info/${this.doctorId}`;
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private dialogRef = inject(MatDialogRef<DialogSendRequests>);
  private sendRequestLink = `${apiUrl}/request/send`;
  private router = inject(Router);
  computedAcceptedForDoctor = () =>
    this.requestData()?.acceptedFromDoctor ?? false;
  computedAcceptedForPatient = () =>
    this.requestData()?.acceptedFromPatient ?? false;
  computedDoctorPhoneNumber = computed(
    () => this.userInfo()?.phoneNumber ?? '-',
  );
 
  authIsTrue = computed(
    () => this.computedAcceptedForDoctor() || this.computedAcceptedForPatient(),
  );
  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');
      this.http
        .get(this.requestAcceptedLink, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.requestData.set(res.token);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
    effect(async () => {
      this.http
        .get(this.userInfoLink, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res: any) => {
            this.userInfo.set(res.token);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }
  async onSendRequest() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const headers = {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    };

    const data = {
      doctorId: this.doctorId,
    };
    this.http.post(this.sendRequestLink, data, { headers }).subscribe({
      next: () => {
        this.toastr.success(this.translate.t('toastr.request_sent'));
        this.dialogRef.close({
          canceled: true,
        });
      },
      error: (err) => {
        this.toastr.error(this.translate.t('toastr.something_went_wrong'));
      },
    });
  }
  goDoctorProfile(){
    const doctorId = this.doctorId;
    this.router.navigate(['profile-view', doctorId]);
    this.dialogRef.close();
  }
}
