import { Route } from '@angular/router';
import { authGuard } from '../guards/auth-guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../pages/layouts/layouts'),
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/home/home'),
      },
      {
        path: 'aboutus',
        loadComponent: () => import('../pages/about-us/about-us'),
      },

      {
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile'),
      },
      {
        path: 'notes/:requestId/:patientId',
        loadComponent: () => import('../pages/notes/notes'),
      },
      {
        path: 'booking',
        loadComponent: () => import('../pages/home/booking/booking'),
      },
      {
        path: 'payment-iyzico',
        loadComponent: () => import('../pages/payment-iyzico/payment-iyzico'),
      },
      {
        path: 'call-back',
        loadComponent: () =>
          import('../pages/payment-iyzico/call-back/call-back'),
      },
      {
        path: 'add-date',
        loadComponent: () => import('../pages/home/add-date/add-date'),
      },
      {
        path: 'notifications',
        loadComponent: () => import('../pages/notifications/notifications'),
      },
      {
        path: 'profile-view/:doctorId',
        loadComponent: () => import('../pages/profile-view/profile-view'),
      },
      {
        path: 'sessions',
        loadComponent: () => import('../pages/sessions/sessions'),
      },
      {
        path: 'patient-files',
        loadComponent: () => import('../pages/patient-file/patient-file'),
      },
      {
        path: 'doctor-files',
        loadComponent: () => import('../pages/doktor-file/doktor-file'),
      },

      {
        path: 'profile/show-info',
        loadComponent: () => import('../pages/profile/show-info/show-info'),
      },
      {
        path: 'profile/edit-info',
        loadComponent: () => import('../pages/profile/edit-info/edit-info'),
      },
      {
        path: 'profile/reset-password',
        loadComponent: () =>
          import('../pages/profile/reset-password/reset-password'),
      },
      {
        path: 'profile/meeting-history',
        loadComponent: () =>
          import('../pages/profile/meeting-history/meeting-history'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login'),
  },

  {
    path: 'register',
    loadComponent: () => import('../pages/register/register'),
  },
  {
    path: 'user/verify-email/:token',
    loadComponent: () => import('../pages/verify-email/verify-email'),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('../pages/login/reset-password/reset-password'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../src-dashboard/layout/layout'),
  },
];
