import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { apiUrl } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../sevices/auth-db';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Translation } from '../../sevices/translation';

interface NotificationItem {
  _id: string;
  type: string;
  sent: boolean;
  sentAt: string;
  appointmentDate: string;
  appointmentTime: string;
  read: boolean;
  bookingId: string;
  message: string;
  doctorId: string;
}

export interface RequestsNotItem {
  _id: string;
  type: 'sent' | 'accepted' | 'canceled';
  message: string;
  sent: boolean;
  sentAt?: string;
  read: boolean;
  requestId: string;
  doctorFirstName: string;
  doctorLastName: string;
  patientFirstName: string;
  patientLastName: string;
  accountType: string;
  doctorId: string;
}

export interface UnifiedNotification {
  _id: string;
  type: string;
  message: string;
  sent: boolean;
  sentAt?: string;
  read: boolean;
  source: 'booking' | 'request';
  itemId: string;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorName?: string;
  patientName?: string;
  accountType: string;
  doctorId: string;
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export default class Notifications implements OnInit {
  bookingNot = signal<NotificationItem[]>([]);
  friendRequests = signal<RequestsNotItem[]>([]);
  private GetBookingNot = `${apiUrl}/booking/notifications`;
  private GetFriendRequests = `${apiUrl}/request/notifications`;
  translate = inject(Translation);

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  screenWidth: number = window.innerWidth;
  public isMobile: boolean = this.screenWidth <= 600;
  ngOnInit(): void {
    this.loadBookingNot();
    this.loadFrieandRequests();
  }
  async loadBookingNot() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get(this.GetBookingNot, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.bookingNot.set(res.token);
          console.log(res.token.read);
        },
      });
  }

  async loadFrieandRequests() {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get(this.GetFriendRequests, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.friendRequests.set(res.token);
          console.log(this.friendRequests());
        },
      });
  }

  getStatus(notType: string) {
    if (notType === 'booked') {
      return 'new Booking';
    } else if (notType === 'canceled') {
      return 'Booking canceled';
    } else if (notType === 'toChange') {
      return 'change request sent';
    } else if (notType === 'changed') {
      return 'Booking Changed';
    } else if (notType === 'paid') {
      return 'Booking paid';
    } else if (notType === 'acceptedPaid') {
      return 'Booking accepted Paid';
    } else if (notType === 'upcoming') {
      return 'Booking will begin shortly';
    } else {
      return '--';
    }
  }

  getAllNotifications = computed(() => {
    // تحويل حجوزات لتكون متوافقة مع الشكل العام
    const bookingNotifications = this.bookingNot().map((n) => ({
      _id: n._id,
      type: n.type,
      message: n.type === 'reminder' ? 'New booking' : n.message,
      sent: n.sent,
      sentAt: n.sentAt,
      read: n.read,
      source: 'booking' as const, // مصدر الإشعار
      itemId: n.bookingId,
      appointmentDate: n.appointmentDate,
      appointmentTime: n.appointmentTime,
      accountType: 'personal',
      doctorId: n.doctorId,
    }));

    // تحويل طلبات الصداقة لتكون بنفس الشكل
    const friendNotifications = this.friendRequests().map((n) => ({
      _id: n._id,
      type: n.type,
      message: n.message,
      sent: n.sent,
      sentAt: n.sentAt,
      read: n.read,
      source: 'request' as const,
      itemId: n.requestId,
      doctorName: `${n.doctorFirstName} ${n.doctorLastName}`,
      patientName: `${n.patientFirstName} ${n.patientLastName}`,
      accountType: n.accountType,
      doctorId: n.doctorId,
    }));

    // دمجهم مع بعض
    const allNotifications: UnifiedNotification[] = [
      ...bookingNotifications,
      ...friendNotifications,
    ];

    // ترتيبهم حسب الوقت من الأحدث للأقدم
    allNotifications.sort((a, b) => {
      const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return timeB - timeA;
    });

    return allNotifications;
  });
  async onBookingClicked(bookingId: string, notificationId: string) {
    const updateNotAsRead = `${apiUrl}/booking/read-notifications/${bookingId}/${notificationId}`;
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .put(
        updateNotAsRead,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )
      .subscribe({
        next: () => {
          if (!this.isMobile) {
            this.router.navigate(['profile']);
          } else {
            this.router.navigate(['sessions']);
          }
        },
        error: (err) => {
          console.log('failed');
        },
      });
  }
  async onRequestClicked(
    requestId: string,
    notificationId: string,
    accountType: string,
    doctorId: string,
  ) {
    const updateNotAsRead = `${apiUrl}/request/read-notifications/${requestId}/${notificationId}`;
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .put(
        updateNotAsRead,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        },
      )
      .subscribe({
        next: () => {
          if (accountType !== 'personal') {
            this.router.navigate(['doctor-files']);
          } else {
            this.router.navigate(['profile-view', doctorId]);
          }
        },
        error: (err) => {
          console.log('failed');
        },
      });
  }
}
