import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { apiUrl, header } from '../../../../src/constants/constants';
import { HttpClient } from '@angular/common/http';
import { UnpermissibleUsersParams } from './IUnpermissibleUsersParams';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../pipes/dashboard-pipes/search-pipe';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-doctors-accounts',
  imports: [FormsModule, SearchPipe, CommonModule],
  templateUrl: './doctors-accounts.html',
  styleUrl: './doctors-accounts.css',
})
export default class DoctorsAccounts implements OnInit {
  unpermissibleSearch = '';
  unpermissibleUsers = signal<UnpermissibleUsersParams[]>([]);
  private getUnpremissibleDoctors = `${apiUrl}/user/dashboard/unpermissible-doctors`;
  private updatePermissible = `${apiUrl}/user/dashboard/unpermissible-doctors/approving`;

  private http = inject(HttpClient);
  unpermissibleCount = computed(() => this.unpermissibleUsers().length);
  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.http.get(this.getUnpremissibleDoctors, header).subscribe({
      next: (res: any) => {
        this.unpermissibleUsers.set(res.token);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onApproving(doctorId: string) {
    const data = {
      doctorId: doctorId,
    };
    this.http.put(this.updatePermissible, data, header).subscribe({
      next: () => {
        this.removeItemFromUI(doctorId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeItemFromUI(doctorId: string) {
    this.unpermissibleUsers.update((users) =>
      users.filter((u) => u._id !== doctorId),
    );
  }
}
