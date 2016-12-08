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

  private _currentCellValue: any;
  private _currentFormattedValue: any;

  constructor(private defaultValuePipe: DefaultValuePipe) { }

  ngOnInit() {
  }

  get cellValue(): any {
    return this.row[this.column.config.id];
  }

  get formattedValue() {
    if (!this.column) { return; }
    if (this.cellValue === this._currentCellValue) {
      // TODO: use default value if both cellValue and currentCellValue are undefined
      return this._currentFormattedValue;
    }
    this._currentCellValue = this.cellValue;

    if (!this.column.config.formatters) {
      this._currentFormattedValue = this.defaultValuePipe.transform(this.cellValue);
    } else {
      this._currentFormattedValue = this.column.config.formatters.reduce((value, formatter) => {
        return formatter.transform(value, ...(formatter.arguments || []));
      }, this.cellValue);
    }
    return this._currentFormattedValue;
  }

  get content(): string {
    return this.contentDiv.nativeElement.textContent;
  }

  get isChanged(): boolean {
    return this.contentDiv.nativeElement.textContent.trim() !== this.formattedValue;
  }

  get hasSubfields() {
    if (!this.column) { return; }
    return this.column.config.subFields && this.column.config.subFields.length > 0;
  }
}
