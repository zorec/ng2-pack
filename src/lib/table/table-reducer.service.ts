import { SortDirection, Row } from './types';
import {
  AddColumnEvent,
  AddColumnAtPositionEvent,
  TableEvent,
  TableEventType,
  ToggleSubfieldEvent,
  SetConfigEvent,
  SortColumnEvent,
} from './events';
import { TableSortingService } from './table-sorting.service';
import { TableInitService } from './table-init.service';
import { TableStateService } from './table-state.service';

import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class TableReducerService {
  nextState = new EventEmitter<void>();
  skipNext = false;

  constructor(
    private tableInitService: TableInitService,
    private tableSortingService: TableSortingService
    ) { }


  reduce(state: TableStateService, event: TableEvent) {
    console.log(TableEventType[event.type]);
    this.skipNext = false;

    switch (event.type) {
      case TableEventType.SetConfig:
        this.setConfig(state, event as SetConfigEvent);
        break;

      case TableEventType.OnChanges:
        this.onChanges(state);
        break;

      case TableEventType.SortColumnInit:
        this.executeInitialSort(state);
        break;

      case TableEventType.SortColumn:
        this.sortColumn(state, event as SortColumnEvent);
        break;

      case TableEventType.AddColumnAtPosition:
        this.addColumn(state, event as AddColumnAtPositionEvent);
        break;

      case TableEventType.ToggleSubfield:
        this.toggleSubfield(state, event as ToggleSubfieldEvent);
        break;

      default:
        return state;
    }

    if (!this.skipNext) {
      this.nextState.emit();
    }
  }

  setConfig(state: TableStateService,
  event: SetConfigEvent) {
    state.columnsLookup = this.tableInitService.columnsConfig2Lookup(event.columnsConfig);
  }

  onChanges(state: TableStateService) {
    const isWithoutData = (typeof state.rows === 'undefined' || state.rows.length === 0);
    if (typeof state.columnsConfig === 'undefined' && !isWithoutData) {
      [state.columnsLookup, state.columnsConfig] =
        this.tableInitService.detectColumnConfiguration(state.rows);
      state.configReload = false;
    }
    if (typeof state.visibleColumns === 'undefined' && typeof state.columnsLookup !== 'undefined') {
      state.visibleColumns = Object.keys(state.columnsLookup);
    }
  }

  private executeInitialSort(state: TableStateService) {
    if (!state.initialSortColumn || !state.rows) {
      this.skipNext = true;
      return;
    }
    let columnName = state.initialSortColumn.slice(1);
    let sortDirection: string = 'asc';
    if (state.initialSortColumn[0] === '+') {
      // pluas at the beginning means 'asc'
      sortDirection = 'asc';

    } else if (state.initialSortColumn[0] === '-') {
      // minus at the beginning means 'desc'
      sortDirection = 'desc';
    } else {
      // direction sign is optional
      columnName = state.initialSortColumn;
    }
    let columnState = state.columnsLookup[columnName];
    if (columnState) {
      sortDirection = sortDirection || columnState.initialSortDirection;
      columnState.currentSortDirection = <SortDirection>sortDirection;
      // initial sort
      this.sortRows(state, {
        type: TableEventType.SortColumn,
        column: columnName,
        direction: sortDirection
      });
    } else {
      console.warn('Missing configuration for column: ' + columnName);
    }
    state.sortedColumnName = columnName;
    state.initialSortColumn = undefined;
  }

  sortColumn(state: TableStateService, sortEvent: SortColumnEvent) {
    const column = state.columnsLookup[sortEvent.column];
    column.currentSortDirection = <SortDirection>sortEvent.direction;
    this.sortRows(state, sortEvent);
  }

  sortRows(state: TableStateService, sortEvent: SortColumnEvent): Row[] {
    if (state.rowsSortingMode === 'default') {
      let {column, direction} = sortEvent;
      state.rows = this.tableSortingService.sort(
        state.rows, state.columnsLookup[column]
      );
      state.sortedColumnName = column;
    } else {
      this.skipNext = true;
    }
    return state.rows;
  }

  addColumn(state: TableStateService, addColumn: AddColumnAtPositionEvent) {
    state.addingColumnIndex = undefined;
    if (typeof addColumn.atPosition !== 'undefined') {
      // the order changed
      state.visibleColumns = [
        ...state.visibleColumns.slice(0, addColumn.atPosition),
        addColumn.value,
        ...state.visibleColumns.slice(addColumn.atPosition),
      ];
    } else {
      state.visibleColumns = [...state.visibleColumns, addColumn.value];
    }
  }

  toggleSubfield(state: TableStateService, toggleEvent: ToggleSubfieldEvent) {
    const column = state.columnsLookup[toggleEvent.column];
    let subfieldIndex = column.activeFields.indexOf(toggleEvent.toggleSubfield);
    if (subfieldIndex === -1) {
      // it was not active, therefore it needs to be actived
      column.activeFields.push(toggleEvent.toggleSubfield);
    } else {
      // it was active, therefore disable it
      column.activeFields.splice(subfieldIndex, 1);
    }
  }
}
