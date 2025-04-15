import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pcNumberSplit'
})
export class PcNumberSplitPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const index = value.indexOf('PC');
    if (index !== -1) {
      return value.substring(index + 2).trim();
    }

    return value;
  }
}
