import {IwColumn, IwColumnConfig} from './../table.component';
import {DefaultValuePipe} from './../../pipes/default-value/default-value.pipe';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css'],
  providers: [DefaultValuePipe]
})
export class IwTdComponent implements OnInit {
  @Input() column: IwColumn;
  @Input() row: any;

  constructor(private defaultValuePipe: DefaultValuePipe) { }

  ngOnInit() {
  }

  displayValue(config: IwColumnConfig, value: any) {
    if (!config.formatters) {
      return this.defaultValuePipe.transform(value);
    }
    return config.formatters.reduce((value, formatter) => {
      return formatter.transform(value, ...(formatter.arguments || []));
    }, value);
  }
}
