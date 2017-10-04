import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateDisplay' })
export class DateDisplayPipe implements PipeTransform {
  transform(value: string): string {
    let re = /(\d\d\d\d)(\d\d)(\d\d)/;
    let results = re.exec(value);
    // If we wanted to, we could add a format specifier to this function
    // to return dates in various ways. But we're just going to stick with
    // US mm/dd/yyyy for now
    return results[2] + '/' + results[3] + '/' + results[1];
  }
}
