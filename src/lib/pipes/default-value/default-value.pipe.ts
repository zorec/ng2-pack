import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue'
})
export class DefaultValuePipe implements PipeTransform {
  transform(value: any, defaultValue: any = '—', args?: any): any {
    if (typeof value !== 'undefined' && !this.isEmptyString(value)) {
      return value;
    }
    return defaultValue;
  }

  private isEmptyString(value: any) {
    return typeof value === 'string' && value.trim() === '';
  }
}
