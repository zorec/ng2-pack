import {DefaultValuePipe} from './../../pipes/default-value/default-value.pipe';
import {DisplayFormatter} from './../types';
import {ColumnState} from './../column-state.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatColumn'
})
export class FormatColumnPipe implements PipeTransform {
  constructor() {

  }

  transform(value: any, arg: ColumnState | DisplayFormatter[]) {
    if (!arg) { return value; }
    const formatters = (Array.isArray(arg)) ? arg : arg.config.formatters;
    return this.applyFormatters(value, formatters);
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
