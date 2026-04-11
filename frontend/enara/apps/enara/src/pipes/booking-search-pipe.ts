import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingSearch',
})
export class BookingSearchPipe implements PipeTransform {
  transform(
    doctors: any[],
    search: string,
    date?: Date,
    hour?: number,
    minute?: number,
    period?: string,
    timeSelected= false,
  ): any[] {
    if (!doctors) return [];

    let result = doctors;

    
    if (search) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (doctor) =>
          doctor.firstName?.toLowerCase().includes(term) ||
          doctor.lastName?.toLowerCase().includes(term),
      );
    }

    
    if (date) {
      const formattedDate = this.formatDate(date);
      result = result.filter((doctor) => doctor.date === formattedDate);
    }

    
    if (timeSelected && hour !== undefined && minute !== undefined && period) {
      const formattedTime = this.formatTime(hour, minute, period);
      result = result.filter((doctor) =>
        doctor.times?.some((t: any) => t.time === formattedTime),
      );
    }

    return result;
  }

  
  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  
  private formatTime(hour: number, minute: number, period: string): string {
    const h = period === 'PM' ? (hour % 12) + 12 : hour % 12;
    const hh = String(h).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}