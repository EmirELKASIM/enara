import { Injectable } from '@angular/core';
export type ProfileView = 'info' | 'editing' | 'resetPass' | 'history';
@Injectable({
  providedIn: 'root',
})
export class ProfileRouter {
  public currentView: ProfileView = 'info';

  router(view: ProfileView) {
    this.currentView = view;
  }

  isInfo() {
    return this.currentView === 'info';
  }

  isEditing() {
    return this.currentView === 'editing';
  }

  isResetPass() {
    return this.currentView === 'resetPass';
  }

  isHistory() {
    return this.currentView === 'history';
  }
}
