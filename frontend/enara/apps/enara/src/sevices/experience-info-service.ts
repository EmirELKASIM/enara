import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiUrl } from '../constants/constants';
import { Translation } from './translation';

@Injectable({
  providedIn: 'root',
})
export class ExperienceInfoService {
  private toastr = inject(ToastrService);
  private updateExperienceLink = `${apiUrl}/experience/update`;
  private http = inject(HttpClient);
  private router = inject(Router);
  translate = inject(Translation);
  checkData(
    experienceSummary: string,
    experienceDesc: string,
    certificates: string,
    language: string,
  ) {
    const validExperienceSummary = experienceSummary.length > 0;
    const validExperienceDesc = experienceDesc.length > 0;
    const validCertificates = certificates.length > 0;
    const validLanguage = language.length > 0;
    if (!validExperienceSummary) {
      this.toastr.warning(
        this.translate.t('toastr.should_write_experience_summary'),
      );
      return false;
    } else if (!validExperienceDesc) {
      this.toastr.warning(this.translate.t('toastr.should_write_description'));
      return false;
    } else if (!validCertificates) {
      this.toastr.warning(
        this.translate.t('toastr.should_provide_certificate'),
      );
      return false;
    } else if (!validLanguage) {
      this.toastr.warning(this.translate.t('toastr.should_enter_language'));
      return false;
    } else {
      return true;
    }
  }
  onExperienceUpdate(
    id: string,
    experienceSummary: string,
    experienceDesc: string,
    certificates: string,
    language: string,
  ) {
    const data = {
      userId: id,
      experienceSummary: experienceSummary,
      experienceDesc: experienceDesc,
      certificates: certificates,
      language: language,
    };
    this.http
      .put(this.updateExperienceLink, data, {
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
