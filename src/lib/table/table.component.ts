import {ColumnState} from './column-state.class';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {ColumnConfig, ColumnLookup, SortDirection, Row, SortingMode} from './types';
import { EditCellEvent, RowClickEvent, ToggleSubfieldEvent, SortColumnEvent } from './events';
import {TableSortingService} from './table-sorting.service';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Inject,
  OnChanges,
  OpaqueToken,
  Output,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

export interface TableDefaultValues {
  reorderingEnabled: boolean;
  rowsSortingMode: SortingMode;
  inlineEditingEnabled: boolean;
  changeColumnVisibility: boolean;
  language: string;
}

export const TableDefaults = new OpaqueToken('TableDefaults');
export const tableDefaultValues: TableDefaultValues = {
  reorderingEnabled: true,
  rowsSortingMode: 'default',
  inlineEditingEnabled: false,
  changeColumnVisibility: true,
  language: 'en',
};

@Component({
  selector: 'iw-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // TODO: enable encapsulation again
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: TableDefaults, useValue: tableDefaultValues}
  ]
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this._columnsConfig = columnsConfig;
    this.columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
  }
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
    this.visibleColumnsChange.emit(this._visibleColumns);
  }

  @Input() rows: Row[];
  @Input() reorderingEnabled: boolean;
  @Input() changeColumnVisibility: boolean;
  @Input() rowsSortingMode: SortingMode;
  @Input() inlineEditingEnabled: boolean;
  // @Input() columnsForAddingFn: (availableColumns: ColumnConfig[]) => any[] = (id) => id
  @Input() set language(language: string) {
    this.i18nService.language = language;
  }
  @Input() initialSortColumn: string | undefined;

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  // @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();
  @Output() visibleColumnsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  columnsLookup: ColumnLookup;
  addingColumnIndex: number;
  customTemplate: boolean = false;
  sortedColumnName: string | null;

  private _visibleColumns: string[];
  private _columnsConfig: ColumnConfig[];

  constructor(
    public elementRef: ElementRef,
    public tableSortingService: TableSortingService,
    public tableInitService: TableInitService,
    public i18nService: I18nService,
    @Inject(TableDefaults) defaults: any,
  ) {
    this.reorderingEnabled =  defaults.reorderingEnabled;
    this.rowsSortingMode =  defaults.rowsSortingMode;
    this.inlineEditingEnabled =  defaults.inlineEditingEnabled;
    this.changeColumnVisibility =  defaults.changeColumnVisibility;
    this.language = defaults.language;
  }

  ngOnChanges() {
    this.initializeDefaults();
    this.initialSort();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customTemplate = this.elementRef.nativeElement.children.length !== 1;
    });
  }

  get visibleColumns() {
    return this._visibleColumns;
  }

  get columnsConfig(): ColumnConfig[] {
    return this._columnsConfig;
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

  onRowClicked(rowClickEvent: RowClickEvent) {
    this.rowClick.emit(rowClickEvent);
  }

  onSortColumn(sortEvent: SortColumnEvent) {
    this.sortColumn.emit(sortEvent);
    if (this.rowsSortingMode === 'default') {
      this.sortRows(sortEvent);
    }
  }

  onAddingColumn(index: number) {
    this.addingColumnIndex = index;
    // TODO: this should emit also when adding to the last column!
    // this.addingColumn.emit(index);
  }

  onReorderColumns(reorderColumnsEvent: string[]) {
    this.reorderColumns.emit(reorderColumnsEvent);
  }

  onToggleSubfield(toggleSubfieldEvent: ToggleSubfieldEvent) {
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  sortRows(sortEvent: SortColumnEvent) {
    let {column, direction} = sortEvent;
    this.rows = this.tableSortingService.sort(
      this.rows, this.columnsLookup[column]
    );
    this.sortedColumnName = column;
  }

  initialSort() {
    if (!this.initialSortColumn || !this.rows) {
      return;
    }
    let columnName = this.initialSortColumn.slice(1);
    let sortDirection: string = 'asc';
    if (this.initialSortColumn[0] === '+') {
      // pluas at the beginning means 'asc'
      sortDirection = 'asc';

    } else if (this.initialSortColumn[0] === '-') {
      // minus at the beginning means 'desc'
      sortDirection = 'desc';
    } else {
      // direction sign is optional
      columnName = this.initialSortColumn;
    }
    let columnState = this.columnsLookup[columnName];
    if (columnState) {
      sortDirection = sortDirection || columnState.initialSortDirection;
      columnState.currentSortDirection = <SortDirection>sortDirection;
      // initial sort
      this.sortRows({column: columnName, direction: sortDirection});
    } else {
      console.warn('Missing configuration for column: ' + columnName);
    }
    this.initialSortColumn = undefined;
  }

  private initializeDefaults() {
    if (typeof this.columnsConfig === 'undefined') {
      [this.columnsLookup, this._columnsConfig] = this.tableInitService.detectColumnConfiguration(this.rows);
    }
    if (typeof this.visibleColumns === 'undefined' && typeof this.columnsLookup !== 'undefined') {
      this.visibleColumns = Object.keys(this.columnsLookup);
    }
  }
}
