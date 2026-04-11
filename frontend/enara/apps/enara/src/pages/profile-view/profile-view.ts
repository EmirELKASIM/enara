import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../sevices/translation';
import { apiUrl } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface InfoParams {
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  gender: string;
  age: string;
  maritalStatus: string;
  consultation: string;
  phoneNumber: string;
}
interface ExperienceParams {
  experienceSummary: string;
  experienceDesc: string;
  certificates: string;
  language: string;
}
@Component({
  selector: 'app-profile-view',
  imports: [CommonModule],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export default class ProfileView implements OnInit {
  doctorInfo = signal<InfoParams | null>(null);
  doctorExperience = signal<ExperienceParams | null>(null);

  doctorId!: string;
  translate = inject(Translation);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  doctorPhoneNumber = computed(() => this.doctorInfo()?.phoneNumber);
  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('doctorId');
    if (!doctorId) {
      this.toastr.warning(this.translate.t('toastr.no_id_found'));
      return;
    }
    this.doctorId = doctorId;
    this.loadDoctorInfo();
    this.loadDoctorExperience();
  }
  loadDoctorInfo() {
    const getDoctorrInfoWithId = `${apiUrl}/user/info/${this.doctorId}`;
    this.http
      .get(getDoctorrInfoWithId, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.doctorInfo.set(res.token);
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
  loadDoctorExperience() {
    const getDoctorExperienceWithId = `${apiUrl}/experience/info/${this.doctorId}`;
    this.http
      .get(getDoctorExperienceWithId, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.doctorExperience.set(res.token);
        },
        error: () => {
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        },
      });
  }
  returnBooking() {
    this.router.navigate(['booking']);
  }
  arabicRegex = /[\u0600-\u06FF]/; 

  getTextDirection(text?: string): 'rtl' | 'ltr' {
    if (!text) return 'ltr'; 
    return this.arabicRegex.test(text) ? 'rtl' : 'ltr';
  }

  getGenderLabels(value?: string): string {
    const map: Record<string, string> = {
      male: this.translate.t('profile-view-page.male'), 
      female: this.translate.t('profile-view-page.female'),
      other: this.translate.t('profile-view-page.other'),
    };
    return (
      map[value || ''] || this.translate.t('profile-view-page.notSpecified')
    );
  }
  getMaritalStatusLabels(value?: string): string {
    const map: Record<string, string> = {
      single: this.translate.t('profile-view-page.single'), 
      married: this.translate.t('profile-view-page.married'),
      divorced: this.translate.t('profile-view-page.divorced'),
      widowed: this.translate.t('profile-view-page.widowed'),
    };
    return (
      map[value || ''] || this.translate.t('profile-view-page.notSpecified')
    );
  }
}
