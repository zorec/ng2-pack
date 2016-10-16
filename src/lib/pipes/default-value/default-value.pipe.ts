import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue'
})
export class DefaultValuePipe implements PipeTransform {
  transform(value: any, defaultValue = '—', args?: any): any {
    if (typeof value !== 'undefined') {
      return value;
    }
    return defaultValue;
  }
}
