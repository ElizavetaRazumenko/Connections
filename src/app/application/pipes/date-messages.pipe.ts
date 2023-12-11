import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateMessages'
})
export class DateMessagesPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(Number(value));
    const day = this.padNumber(date.getDate());
    const month = this.padNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.padNumber(date.getHours());
    const minutes = this.padNumber(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  private padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
