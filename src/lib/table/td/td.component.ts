import {ColumnConfig} from './../table.component';
import {ColumnState} from './../column-state.class';
import {DefaultValuePipe} from './../../pipes/default-value/default-value.pipe';

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css'],
  providers: [DefaultValuePipe]
})
export class TdComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() row: any;

  constructor(private defaultValuePipe: DefaultValuePipe) { }

  ngOnInit() {
  }

  displayValue(config: ColumnConfig, value: any) {
    if (!config.formatters) {
      return this.defaultValuePipe.transform(value);
    }
    return config.formatters.reduce((value, formatter) => {
      return formatter.transform(value, ...(formatter.arguments || []));
    }, value);
  }
}
