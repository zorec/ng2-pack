import {ColumnState} from './../column-state.class';
import {FormatColumnPipe} from './../pipes/format-column.pipe';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: 'td.component.html',
  styleUrls: ['./td.component.css'],
  providers: [FormatColumnPipe]
})
export class TdComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() row: any;

  @ViewChild('contentDiv') contentDiv: ElementRef;

  private _currentCellValue: any;
  private _currentFormattedValue: any;

  constructor(private formatColumnPipe: FormatColumnPipe) { }

  ngOnInit() {
  }

  get cellValue(): any {
    if (!this.column) { return; }
    return this.row[this.column.config.id];
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

  get formattedValue() {
    if (!this.column) { return; }
    return this.formatColumnPipe.transform(this.cellValue, this.column);
  }
}
