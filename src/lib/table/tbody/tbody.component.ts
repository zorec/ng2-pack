import {TableComponent, ColumnLookup, ColumnConfig, RowClickEvent} from './../table.component';
import {ColumnState} from './../column-state.class';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[iw-tbody]',
  templateUrl: './tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class TbodyComponent implements OnInit {
  // NOTE: not sure whather this should be a public API
  @Input() addingColumnIndex: number;

  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  constructor(private tableComponent: TableComponent) { }

  ngOnInit() {
  }

  get rows(): any[] {
    return this.tableComponent.rows;
  }

  get columnsConfig(): ColumnConfig[] {
    return this.tableComponent.columnsConfig;
  };

  get visibleColumns(): string[] {
    return this.tableComponent.visibleColumns;
  };

  column(columnName: string): ColumnState {
    return this.tableComponent.columnsLookup[columnName];
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }
}
