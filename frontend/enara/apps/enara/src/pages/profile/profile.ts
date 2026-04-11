import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import ShowInfo from './show-info/show-info';

import ResetPassword from './reset-password/reset-password';
import MeetingHistory from './meeting-history/meeting-history';
import { ProfileRouter } from '../../sevices/profile-router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import DialogDeleteAccount from './dialog-delete-account/dialog-delete-account';
import DialogLogout from './dialog-logout/dialog-logout';
import { Router } from '@angular/router';
import { BackButtonService } from '../../sevices/back-button-service';
import EditInfo from './edit-info/edit-info';
import { Translation } from '../../sevices/translation';
import { AuthService } from '../../sevices/auth-db';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    ShowInfo,
    EditInfo,
    ResetPassword,
    MeetingHistory,
    HttpClientModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export default class Profile implements OnInit, AfterViewChecked {
  public profileRouter = inject(ProfileRouter);
  public auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private router = inject(Router);
  private backButton = inject(BackButtonService);
  translate = inject(Translation);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  public isTablet: boolean =
    this.screenWidth >= 600 && this.screenWidth <= 1200;

  ngOnInit() {
    this.checkScreen();
  }
  @ViewChild('scrollSection') section!: ElementRef;
  shouldScroll = false;
  ngAfterViewChecked() {
    if (this.isMobile || this.isTablet) {
      if (this.shouldScroll && this.section) {
        this.shouldScroll = false;

        // حساب موقع العنصر بالنسبة للصفحة
        const y =
          this.section.nativeElement.getBoundingClientRect().top +
          window.scrollY;

        // نحدد المسافة التي نريد إضافتها (مثلاً 100px)
        window.scrollTo({
          top: 800, // 100px أعلى من العنصر
          behavior: 'smooth',
        });
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = this.screenWidth <= 600;
  }

  showInfo() {
    if (!this.isMobile && !this.isTablet) {
      this.profileRouter.router('info');
      this.shouldScroll = true;
    } else {
      this.router.navigate(['profile/show-info']);
      this.backButton.show();
    }
  }
  showEdititng() {
    if (!this.isMobile && !this.isTablet) {
      this.profileRouter.router('editing');
      this.shouldScroll = true;
    } else {
      this.router.navigate(['profile/edit-info']);
      this.backButton.show();
    }
  }
  showResetPass() {
    if (!this.isMobile && !this.isTablet) {
      this.profileRouter.router('resetPass');
      this.shouldScroll = true;
    } else {
      this.router.navigate(['profile/reset-password']);
      this.backButton.show();
    }
  }
  showHistory() {
    if (!this.isMobile && !this.isTablet) {
      this.profileRouter.router('history');
      this.shouldScroll = true;
    } else {
      this.router.navigate(['profile/meeting-history']);
      this.backButton.show();
    }
  }

  onlogoutDialog() {
    this.dialog.open(DialogLogout, {
      panelClass: 'logout-dialog',
    });
  }
  onDeleteDialog() {
    this.dialog.open(DialogDeleteAccount, {
      panelClass: 'delete-account-dialog',
    });
  }
}
