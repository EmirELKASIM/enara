import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { apiUrl } from '../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Translation } from '../../../../src/sevices/translation';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
interface SummaryParams {
  psychologicalSummary:string;
}
@Component({
  selector: 'app-patient-summary',
  imports: [CommonModule, MatIconModule],
  templateUrl: './patient-summary.html',
  styleUrl: './patient-summary.css',
})
export default class PatientSummary implements OnInit{
  patientSummary = signal<SummaryParams | null>(null)
  @Input() patientId!: string;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  translate = inject(Translation);

  ngOnInit(){
    this.loadSummary();
  }
  loadSummary(){
    const getPatientSummary = `${apiUrl}/summary/info/${this.patientId}`;
    this.http.get(getPatientSummary,{
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }).subscribe({
        next:(res : any)=>{
          this.patientSummary.set(res.token);
        },
        error:()=>{
          this.toastr.error(this.translate.t('toastr.something_went_wrong'));
        }
      })
  }
  arabicRegex = /[\u0600-\u06FF]/; // أي حرف عربي

  getTextDirection(text?: string): 'rtl' | 'ltr' {
    if (!text) return 'ltr'; // إذا النص undefined أو فارغ
    return this.arabicRegex.test(text) ? 'rtl' : 'ltr';
  }
}
