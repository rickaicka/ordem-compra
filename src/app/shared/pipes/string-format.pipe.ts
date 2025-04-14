import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatString'
})
export class FormatStringPipe implements PipeTransform {
  transform(value: string, maxLength: number = 20): string {
    if (!value) return '';

    if (value.length > maxLength) {
      return value.slice(0, maxLength) + '...';
    }

    return value;
  }
}
