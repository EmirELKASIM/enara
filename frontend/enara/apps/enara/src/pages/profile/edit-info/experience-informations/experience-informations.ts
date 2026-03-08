import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExperienceInfo } from '../iUserInfoEdit';
import { ExperienceInfoService } from '../../../../sevices/experience-info-service';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Translation } from '../../../../../src/sevices/translation';
@Component({
  selector: 'app-experience-informations',
  imports: [HttpClientModule, FormsModule, MatFormFieldModule, MatInputModule,MatProgressSpinnerModule],
  templateUrl: './experience-informations.html',
  styleUrl: './experience-informations.css',
})
export default class ExperienceInformations implements OnInit {
  @Input() editMode = false;
  @Input({ required: true }) id!: string;
  experienceSummary = '';
  experienceDesc = '';
  certificates = '';
  language = '';
  public enableExperience = false;
  private http = inject(HttpClient);
  private experienceApi = `${apiUrl}/experience/info`;
  translate = inject(Translation);

  private auth = inject(AuthService);
  private experienceInfoService = inject(ExperienceInfoService)
  experienceInfo = signal<ExperienceInfo | null>(null);
  computedId = computed(() => this.experienceInfo()?.id ?? '-');
  computedExperienceSummary = computed(
    () => this.experienceInfo()?.experienceSummary ?? '-',
  );
  computedExperienceDesc = computed(
    () => this.experienceInfo()?.experienceDesc ?? '-',
  );
  computedCertificates = computed(
    () => this.experienceInfo()?.certificates ?? '-',
  );
  computedLanguage = computed(() => this.experienceInfo()?.language ?? '-');
  onResetExperience() {
    this.enableExperience = false;
    this.experienceSummary = this.computedExperienceSummary();
    this.experienceDesc = this.computedExperienceDesc();
    this.certificates = this.computedCertificates();
    this.language = this.computedLanguage();
  }
  onEnabledExperience() {
    this.enableExperience = !this.enableExperience;
  }
  toggleExperience() {
    if (this.enableExperience) {
      this.onResetExperience();
    } else {
      this.onEnabledExperience();
    }
  }
  async ngOnInit() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get<ExperienceInfo>(this.experienceApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      })
      .subscribe({
        next: (res: any) => {
          this.experienceInfo.set(res.token);
          this.experienceSummary = res.token.experienceSummary;
          this.experienceDesc = res.token.experienceDesc;
          this.certificates = res.token.certificates;
          this.language = res.token.language;
        },
        error: (err) => {
          console.log(err.error?.token);
          
        },
      });
  }

  checkData() {
   return this.experienceInfoService.checkData(this.experienceSummary,this.experienceDesc,this.certificates,this.language)
  
  }

  onExperienceUpdate() {
    this.experienceInfoService.onExperienceUpdate(this.id,this.experienceSummary,this.experienceDesc,this.certificates,this.language)
  }
  isUpdating = true;
  formatText(text: string): string {
    if (!text) return '';

    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  }
}
