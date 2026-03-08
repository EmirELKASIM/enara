import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiUrl } from '../../constants/constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Translation } from '../../sevices/translation';

@Component({
  selector: 'app-verify-email',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export default class VerifyEmail implements OnInit{
  message= signal<string>('');
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  translate = inject(Translation);

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    this.http.get(`${apiUrl}/user/verify-email/${token}`).subscribe({
      next: (res:any) => {
        this.message.set(res.token);
      },
      error: (err) => {
        console.log(err);
        
      },
    });
  }
  goLogin() {
    this.router.navigate(['login']);
  }
  changeLang(lang: string) {
    this.translate.changeLang(lang);
  }
}
