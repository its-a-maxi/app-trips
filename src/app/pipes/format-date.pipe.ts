import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatDatePipe',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {

  transform(date: Date): string {
    return date.toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: 'numeric'});
  }

}
