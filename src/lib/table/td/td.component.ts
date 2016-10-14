import {ColumnConfig} from '../types';
import {ColumnState} from './../column-state.class';
import {DefaultValuePipe} from './../../pipes/default-value/default-value.pipe';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css'],
  providers: [DefaultValuePipe]
})
export class TdComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() row: any;

  @ViewChild('contentDiv') contentDiv: ElementRef;

  constructor(private defaultValuePipe: DefaultValuePipe) { }

  ngOnInit() {
  }

  get cellValue(): any {
    return this.row[this.column.config.id]
  }

  get formattedValue() {
    if (!this.column.config.formatters) {
      return this.defaultValuePipe.transform(this.cellValue);
    }
    return this.column.config.formatters.reduce((value, formatter) => {
      return formatter.transform(value, ...(formatter.arguments || []));
    }, this.cellValue);
  }

  get content(): string {
    return this.contentDiv.nativeElement.textContent;
  }

  get isChanged(): boolean {
    return this.contentDiv.nativeElement.textContent.trim() !== this.formattedValue;
  }

  get hasSubfields() {
    return this.column.config.subFields && this.column.config.subFields.length > 0
  }
}
