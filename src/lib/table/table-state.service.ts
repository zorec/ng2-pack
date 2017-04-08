import { ColumnState } from './column-state.class';
import { ColumnConfig, ColumnLookup, Row, SortingMode } from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class TableStateService {
  set rows(rows: Row[]) {
    this._rows = rows;
    this.configReload = true;
  }
  get rows() {
    return this._rows;
  }

  set columnsConfig(columnConfig: ColumnConfig[]) {
    this._columnsConfig = columnConfig;
    this.configReload = true;
  }
  get columnsConfig() {
    return this._columnsConfig;
  }

  visibleColumns: string[];
  columnsLookup: ColumnLookup;
  sortedColumnName: string | undefined;
  addingColumnIndex: number | undefined;
  initialSortColumn: string | undefined;

  // defaults
  reorderingEnabled = true;
  rowsSortingMode: SortingMode = 'default';
  inlineEditingEnabled = false;
  changeColumnVisibility = true;
  language = 'en';

  configReload: boolean = false;
  // these values require re-initialization with table-init.service
  private _rows: Row[];
  private _columnsConfig: ColumnConfig[];

  constructor() {

  }

  isSorted(column: ColumnState, direction: string) {
    if (!column) { return; }
    let isSorted: boolean = column.config.id === this.sortedColumnName;
    if (!direction) {
      return isSorted;
    } else {
      let directionMatch: boolean = column.currentSortDirection === direction;
      return isSorted && directionMatch;
    }
  }

}
