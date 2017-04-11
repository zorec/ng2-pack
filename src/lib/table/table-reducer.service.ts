import { SortDirection, Row } from './types';
import {
  AddColumnEvent,
  AddColumnAtPositionEvent,
  AddingColumnEvent,
  DragPreviewEvent,
  EditCellEvent,
  TableEvent,
  TableEventType,
  ToggleSubfieldEvent,
  RemoveColumnEvent,
  RowClickEvent,
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
    this.skipNext = false;

    switch (event.type) {
      case TableEventType.OnChanges:
        this.onChanges(state);
        break;

      case TableEventType.SortColumnInit:
        this.executeInitialSort(state);
        break;

      case TableEventType.SortColumn:
        this.sortColumn(state, event as SortColumnEvent);
        break;

      case TableEventType.AddingColumn:
        this.addingColumn(state, event as AddingColumnEvent);
        break;

      case TableEventType.AddColumnAtPosition:
        this.addColumn(state, event as AddColumnAtPositionEvent);
        break;

      case TableEventType.DragPreview:
        this.previewColumns(state, event as DragPreviewEvent);
        break;

      case TableEventType.DragEnd:
        this.revertPreview(state);
        break;

      case TableEventType.DropColumn:
        this.dropColumn(state);
        break;

      case TableEventType.RemoveColumn:
        this.removeColumn(state, event as RemoveColumnEvent);
        break;

      case TableEventType.ToggleSubfield:
        this.toggleSubfield(state, event as ToggleSubfieldEvent);
        break;

      case TableEventType.RowClick:
        this.skipNext = true;
        break;

      case TableEventType.EditCell:
        this.skipNext = true;
        break;

      default:
        return state;
    }

    if (!this.skipNext) {
      // console.log(TableEventType[event.type], event);
      this.nextState.emit();
    }
    // this.skipNext && console.log('skipping ' + TableEventType[event.type]);
  }

  onChanges(state: TableStateService) {
    if (typeof state.columnsConfig !== 'undefined') {
      state.columnsLookup = this.tableInitService.columnsConfig2Lookup(state.columnsConfig);
    }
    const isWithoutData = (typeof state.rows === 'undefined' || state.rows.length === 0);
    if (typeof state.columnsConfig === 'undefined' && !isWithoutData) {
      [state.columnsLookup, state.columnsConfig] =
        this.tableInitService.detectColumnConfiguration(state.rows);
    }
    if (typeof state.visibleColumns === 'undefined' && typeof state.columnsLookup !== 'undefined') {
      state.visibleColumns = Object.keys(state.columnsLookup);
    }
  }

  executeInitialSort(state: TableStateService) {
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
        columnState,
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
    if (state.rowsSortingMode === 'disabled') {
      this.skipNext = true;
    } else if (state.rowsSortingMode === 'external') {
      state.sortedColumnName = sortEvent.column;
    } else {
      let {column, direction} = sortEvent;
      state.rows = this.tableSortingService.sort(
        state.rows, state.columnsLookup[column]
      );
      state.sortedColumnName = sortEvent.column;
    }

    return state.rows;
  }

  addingColumn(state: TableStateService, addingColumn: AddingColumnEvent) {
    state.addingColumnIndex = addingColumn.index;
  }

  addColumn(state: TableStateService, addColumn: AddColumnAtPositionEvent) {
    state.addingColumnIndex = undefined;
    if (typeof addColumn.index !== 'undefined') {
      // the order changed
      state.visibleColumns = [
        ...state.visibleColumns.slice(0, addColumn.index),
        addColumn.column,
        ...state.visibleColumns.slice(addColumn.index),
      ];
    } else {
      state.visibleColumns = [...state.visibleColumns, addColumn.column];
    }
  }

  previewColumns(state: TableStateService, dragPreview: DragPreviewEvent) {
    // remember the state before the first preview
    state.visibleColumnsBeforePreview = state.visibleColumnsBeforePreview || state.visibleColumns;
    state.visibleColumns = dragPreview.columns;
  }

  revertPreview(state: TableStateService) {
    if (state.visibleColumnsBeforePreview) {
      state.visibleColumns = state.visibleColumnsBeforePreview;
    }
    state.visibleColumnsBeforePreview = undefined;
  }

  dropColumn(state: TableStateService) {
    state.visibleColumnsBeforePreview = undefined;
  }

  removeColumn(state: TableStateService, removeColumn: RemoveColumnEvent) {
    state.visibleColumns = [
      ...state.visibleColumns.slice(0, removeColumn.index),
      ...state.visibleColumns.slice(removeColumn.index + 1),
    ];
  }

  toggleSubfield(state: TableStateService, toggleEvent: ToggleSubfieldEvent) {
    const column = state.columnsLookup[toggleEvent.column];
    let subfieldIndex = column.activeFields.indexOf(toggleEvent.toggleSubfield);
    if (subfieldIndex === -1) {
      // it was not active, therefore it needs to be actived
      column.activeFields = [
        ...column.activeFields,
        toggleEvent.toggleSubfield
      ];
    } else {
      // it was active, therefore disable it
      column.activeFields = [
        ...column.activeFields.slice(0, subfieldIndex),
        ...column.activeFields.slice(subfieldIndex + 1)
      ];
    }
  }
}
