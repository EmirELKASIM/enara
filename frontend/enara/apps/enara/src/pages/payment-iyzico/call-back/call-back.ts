import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { apiUrl } from '../../../../src/constants/constants';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Translation } from '../../../../src/sevices/translation';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../src/sevices/auth-db';

@Component({
  selector: 'app-call-back',
  imports: [CommonModule],
  templateUrl: './call-back.html',
  styleUrl: './call-back.css',
})
export default class CallBack implements OnInit {
  status = 'processing';
  private bookingAddLink = `${apiUrl}/booking/add`;
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  translate = inject(Translation);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    this.status = 'processing';
    if (!token) {
      this.status = 'failed';
      return;
    }
    const verifyPaymentLink = `${apiUrl}/payment/verify-payment`;
    const cardPaymentLink = `${apiUrl}/booking/paid-card`;

    this.http.post<any>(verifyPaymentLink, { token }).subscribe({
      next: async (res) => {
        if (res.status === 'success') {
          this.status = 'success';
          const data = JSON.parse(localStorage.getItem('bookingData')!);
          console.log(data);
          const paymentData = {
            appointmentId: data.appointmentId,
            doctorId: data.doctorId,
          };
          const mainToken = await this.auth.getToken();
          if (!mainToken) throw new Error('Token not found');
          this.http
            .post(this.bookingAddLink, data, {
              headers: {
                Authorization: `Bearer ${mainToken}`,
                'ngrok-skip-browser-warning': 'true',
              },
            })
            .subscribe({
              next: () => {
                this.toastr.success(
                  this.translate.t('toastr.appointment_booked'),
                );
                this.http.put(cardPaymentLink, paymentData, {
                  headers: {
                    Authorization: `Bearer ${mainToken}`,
                    'ngrok-skip-browser-warning': 'true',
                  },
                }).subscribe({
                  error:(err)=>{
                    console.log(err.error.token);
                    
                  }
                });
                localStorage.removeItem('bookingData');
              },
              error: (err) => {
                console.log(err);
                console.log(err.error);
                console.log(err.error?.token);
                this.toastr.error(
                  this.translate.t('toastr.something_went_wrong'),
                );
              },
            });
        } else {
          this.status = 'failed';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.status = 'failed';
      },
    });
  }
  goHome() {
    this.router.navigate(['']);
  }
}
