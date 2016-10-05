import {IwTableComponent, IwColumnLookup, IwColumnConfig, IwColumn, RowClickEvent} from './../table.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[iw-body]',
  templateUrl: './tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class IwTbodyComponent implements OnInit {
  @Input() rows: any[];
  @Input() addingColumnIndex: number;

  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  constructor(private tableComponent: IwTableComponent) { }

  ngOnInit() {
  }

  get columnsConfig(): IwColumnConfig[] {
    return this.tableComponent.columnsConfig;
  };

  get visibleColumns(): string[] {
    return this.tableComponent.visibleColumns;
  };

  column(columnName: string): IwColumn {
    return this.tableComponent.columnsLookup[columnName];
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }
}
