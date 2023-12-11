import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZero'
})
export class LeadingZeroPipe implements PipeTransform {
  public transform(time: number): string {
    return time === 60 ? '00' : `${time}`.padStart(2, '0');
  }
}
