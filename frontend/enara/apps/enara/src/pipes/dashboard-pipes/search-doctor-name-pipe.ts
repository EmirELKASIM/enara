import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDoctorName',
})
export class SearchDoctorNamePipe implements PipeTransform {
transform(value: any[], search: string): any[] {
    if (!value) return [];
    if (!search) return value;

    const term = search.toLowerCase().trim();

    return value.filter((item) =>
      item.doctorName?.toLowerCase().includes(term),
    );
  }

}
