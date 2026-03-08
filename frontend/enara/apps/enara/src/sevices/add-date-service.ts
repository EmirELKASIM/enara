import { HttpClient } from '@angular/common/http';
import { inject, Injectable, WritableSignal } from '@angular/core';
import { AuthService } from './auth-db';
import { apiUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AddDateService {
  private http = inject(HttpClient);
  private addDateApi = `${apiUrl}/appointment/info`;
  private auth = inject(AuthService);
  addTimeToUI(dateStr: string, timeStr: string, dates: WritableSignal<any[]>, price:string, coinType:string) {
    dates.update((days) => {
      const dayIndex = days.findIndex((d) => d.date === dateStr);

      const newTimeObj = {
        _id: crypto.randomUUID(),
        time: timeStr,
        status: 'pending',
        price: price,
        coinType: coinType
      };

      if (dayIndex !== -1) {
        const updatedDays = [...days];
        const day = updatedDays[dayIndex];

        if (!day.times.some((t: any) => t.time === timeStr)) {
          updatedDays[dayIndex] = {
            ...day,
            times: [...day.times, newTimeObj],
          };
        }

        return updatedDays;
      }

      return [
        ...days,
        {
          date: dateStr,
          day: new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
          }),
          times: [newTimeObj],
        },
      ];
    });
  }

  async loadDates(dates: WritableSignal<any[]>) {
    const token = await this.auth.getToken();
    if (!token) throw new Error('Token not found');
    this.http
      .get(this.addDateApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      })
      .subscribe({
        next: (res: any) => {
          dates.set(res.token);
        },
        error: (err) => console.log(err),
      });
  }
  removeTimeFromUI(date: string, time: string, dates: WritableSignal<any[]>) {
    dates.update((days) =>
      days
        .map((d) => {
          if (d.date === date) {
            return {
              ...d,
              times: d.times.filter((t: any) => t.time !== time),
            };
          }
          return d;
        })
        .filter((d) => d.times.length > 0),
    );
  }

  removeAllTimesFromUI(date: string, dates: WritableSignal<any[]>) {
    dates.update(
      (days) =>
        days
          .map((d) => {
            if (d.date === date) {
              return {
                ...d,
                times: [], 
              };
            }
            return d;
          })
          .filter((d) => d.times.length > 0), 
    );
  }
}
