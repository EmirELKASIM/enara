import {
  Component,
  computed,
  inject,
  Input,
  signal,
  OnInit,
} from '@angular/core';
import { SummaryInfo } from '../iUserInfoEdit';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SummaryInfoService } from '../../../../sevices/summary-info-service';
import { AuthService } from '../../../../sevices/auth-db';
import { apiUrl } from '../../../../constants/constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Translation } from '../../../../../src/sevices/translation';

@Component({
  selector: 'app-summary-informations',
  imports: [
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './summary-informations.html',
  styleUrl: './summary-informations.css',
})
export default class SummaryInformations implements OnInit {
  @Input() editMode = false;
  @Input({ required: true }) id!: string;
  psychologicalSummary = '';
  summaryInfo = signal<SummaryInfo | null>(null);
    translate = inject(Translation);
  
  public enableSummary = false;
  private summaryApi = `${apiUrl}/summary/info`;
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private summaryInfoService = inject(SummaryInfoService);

  computedPsychologicalSummary = computed(
    () => this.summaryInfo()?.psychologicalSummary ?? '-',
  );
  onEnabledSummary() {
    this.enableSummary = !this.enableSummary;
  }
  onResetSummary() {
    this.enableSummary = false;
    this.psychologicalSummary = this.computedPsychologicalSummary();
  }
  toggleSummary() {
    if (this.enableSummary) {
      this.onResetSummary();
    } else {
      this.onEnabledSummary();
    }
  }
  async ngOnInit() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    const headers = {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    };

    this.http.get<SummaryInfo>(this.summaryApi, { headers }).subscribe({
      next: (res: any) => {
        this.summaryInfo.set(res.token);
        this.psychologicalSummary = res.token.psychologicalSummary;
      },
      error: (err) => {
        console.log(err.error?.token);
        
      },
    });
  }
  checkData() {
    const validSummary = this.psychologicalSummary.length > 0;
    if (!validSummary) {
      this.toastr.warning(this.translate.t("toastr.should_write_summary"));
      return false;
    }
    return true;
  }

  isUpdating = false;
  onSummaryUpdate() {
    const isTrue = this.checkData();
    if (!isTrue) {
      return;
    } else {
      this.isUpdating = true;

      this.summaryInfoService.onSummaryUpdate(
        this.id,
        this.psychologicalSummary,
      );
    }
    this.isUpdating = false;
  }
}
