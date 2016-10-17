import {I18nService} from './../../services/i18n.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 't'
})
export class TPipe implements PipeTransform {
  constructor(private i18nService: I18nService) {}

  transform(value: any, args?: any): any {
    return this.i18nService.get(value);
  }

}
