import {IwColumnLookup, IwColumnConfig, IwColumn, RowClickEvent} from './../table.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[iw-body], [iwBody]',
  templateUrl: './tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class IwTbodyComponent implements OnInit {
  @Input() rows: any[];
  @Input() columnsConfig: IwColumnConfig[] = [];
  @Input() columnsLookup: IwColumnLookup;
  @Input() visibleColumns: string[] = [];
  @Input() addingColumnIndex: number;
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  constructor() { }

  ngOnInit() {
  }

  column(columnName: string): IwColumn {
    return this.columnsLookup[columnName];
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }

}
