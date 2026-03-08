import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './IUserInfo';
import { BackButtonService } from '../../sevices/back-button-service';
import { AuthService } from '../../sevices/auth-db';
import { apiUrl } from '../../constants/constants';
import { Translation } from '../../sevices/translation';

@Component({
  selector: 'app-home',
  imports: [HttpClientModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home {
  private profileApi = `${apiUrl}/user/info`;
  translate = inject(Translation);

  info = signal<UserInfo | null>(null);
  private router = inject(Router);
  private http = inject(HttpClient);
  private backButton = inject(BackButtonService);
  private auth = inject(AuthService);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  computedAccountType = computed(() => this.info()?.accountType ?? '-');
  computeduserId = computed(() => this.info()?.id ?? '-');
  goBooking() {
    this.router.navigate(['booking']);
    if (this.isMobile) {
      this.backButton.show();
    }
  }
  goAddDate() {
    this.router.navigate(['add-date']);
    if (this.isMobile) {
      this.backButton.show();
    }
  }
  goDoctorFiles() {
    this.router.navigate(['doctor-files']);
  }
  goPatientFiles() {
    this.router.navigate(['patient-files']);
  }
  goLogin(){
    this.router.navigate(["login"])
  }
  toggleAsAccountType(){
    const isAuth = this.computedAccountType() === "personal" || this.computedAccountType() === 'psychotherapist' || this.computedAccountType() === 'psychiatrist';
    if(!isAuth){
      this.router.navigate(["login"]);
    }else if(this.computedAccountType() === "personal") {
      this.router.navigate(['booking']);
    }else if(this.computedAccountType() === 'psychotherapist' || this.computedAccountType() === 'psychiatrist'){
      this.router.navigate(["add-date"]);
    }else{
      return;
    }
  }
  isAuth(){
    const isAuth = this.computedAccountType() === "personal" || this.computedAccountType() === 'psychotherapist' || this.computedAccountType() === 'psychiatrist';
    if(!isAuth){
      return false;
    }else{
      return true;
    }
  }

  constructor() {
    effect(async () => {
      const token = await this.auth.getToken();
      if (!token) throw new Error('Token not found');

      this.http
        .get<UserInfo>(this.profileApi, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .subscribe({
          next: (res) => {
            this.info.set(res);
            
          },
          error: (err) => {
            console.log('error: ', err);
          },
        });
    });
  }
}
