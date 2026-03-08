import { Component,  computed,  effect, inject, signal } from '@angular/core';
import { PersonalUsersParams } from './IPersonalUsersParams';
import { apiUrl, header } from '../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../../src/pipes/search-pipe';

@Component({
  selector: 'app-users',
  imports: [FormsModule,SearchPipe],
  templateUrl: './users.html',
  styleUrls: ['./users.css','./personal-users.css'],
})
export default class Users {
  personalSearch = '';
  impersonalSearch = '';
  personalUsers = signal<PersonalUsersParams[]>([]);
  impersonalUsers = signal<PersonalUsersParams[]>([]);
  private GetPersonalUsersLink = `${apiUrl}/user/dashboard/personal-users`;
  private GetImpersonalUsersLink = `${apiUrl}/user/dashboard/impersonal-users`;
  personalCount = computed(() => this.personalUsers().length);
  impersonalCount = computed(() => this.impersonalUsers().length);

  private http = inject(HttpClient);
  constructor() {
    effect(() => {
      this.http.get(this.GetPersonalUsersLink, header).subscribe({
        next: (res: any) => {
          this.personalUsers.set(res.token);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
    effect(() => {
      this.http.get(this.GetImpersonalUsersLink, header).subscribe({
        next: (res: any) => {
          this.impersonalUsers.set(res.token);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
    
  }
}
