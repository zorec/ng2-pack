import {DefaultValuePipe} from './../../pipes/default-value/default-value.pipe';
import {DisplayFormatter} from './../types';
import {ColumnState} from './../column-state.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatColumn'
})
export class FormatColumnPipe implements PipeTransform {
  constructor(private defaultValuePipe: DefaultValuePipe) {

  }

  transform(value: any, column: ColumnState) {
    if (!column) { return; }
    let formattedValue = this.applyFormatters(value, column.config.formatters);
    return this.defaultValuePipe.transform(formattedValue, '—');
  }

  applyFormatters(value: any, formatters: undefined | DisplayFormatter[]): any {
    if (!formatters) {
      return value;
    }
    return formatters.reduce((currentValue, formatter) => {
      let args = formatter.arguments || [];
      return formatter.transform(currentValue, ...args);
    }, value);
  }
}
