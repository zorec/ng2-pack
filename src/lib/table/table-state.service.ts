import {
  AddingColumnEvent,
  AddColumnAtPositionEvent,
  EditCellEvent,
  RemoveColumnEvent,
  RowClickEvent,
  SortColumnEvent,
  ToggleSubfieldEvent
} from './events';
import { ColumnState } from './column-state.class';
import { ColumnConfig, ColumnLookup, Row, SortingMode } from './types';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class TableStateService {
  rows: Row[];
  columnsConfig: ColumnConfig[];
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

  // output events
  addingColumn = new EventEmitter<AddingColumnEvent>();
  addColumn = new EventEmitter<AddColumnAtPositionEvent>();
  removeColumn = new EventEmitter<RemoveColumnEvent>();
  sortColumn = new EventEmitter<SortColumnEvent>();
  sortColumnInit = new EventEmitter<void>();
  toggleSubfield = new EventEmitter<ToggleSubfieldEvent>();
  visibleColumnsChange = new EventEmitter<string[]>();
  rowClick = new EventEmitter<RowClickEvent>();
  editCell = new EventEmitter<EditCellEvent>();


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
