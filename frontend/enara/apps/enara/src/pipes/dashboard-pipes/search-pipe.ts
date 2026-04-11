import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: true,
})
export class SearchPipe implements PipeTransform {
  transform(value: any[], search: string): any[] {
    if (!value || !search) return value;

    const term = search.toLowerCase().trim();

    return value.filter(
      (item) =>
        item.firstName?.toLowerCase().includes(term) ||
        item.lastName?.toLowerCase().includes(term) ||
        item.age?.toString().includes(term),
    );
  }
}
