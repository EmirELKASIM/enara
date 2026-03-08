import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BackButtonService {
  private showBackSubject = new BehaviorSubject<boolean>(false);
  showBack$ = this.showBackSubject.asObservable();

  show() {
    this.showBackSubject.next(true);
  }

  hide() {
    this.showBackSubject.next(false);
  }
}
