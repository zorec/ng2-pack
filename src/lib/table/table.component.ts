import {ColumnState} from './column-state.class';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {ColumnConfig, ColumnLookup, Row} from './types';
import {EditCellEvent} from './events';
import {TableSortingService} from './table-sorting.service';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Inject,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

export interface TableDefaultValues {
  reorderingEnabled: boolean;
  sortingEnabled: boolean;
  inlineEditingEnabled: boolean;
  changeColumnVisibility: boolean;
  language: string;
}
export let tabledefaultValues: TableDefaultValues = {
  reorderingEnabled: true,
  sortingEnabled: true,
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
    {provide: 'tabledefaultValues', useValue: tabledefaultValues}
  ]
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
    this.visibleColumnsChange.emit(this._visibleColumns);
  }
  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this._columnsConfig = columnsConfig;
    this.columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
  }

  @Input() rows: Row[];
  @Input() reorderingEnabled: boolean;
  @Input() sortingEnabled: boolean;
  @Input() inlineEditingEnabled: boolean;
  @Input() changeColumnVisibility: boolean;
  // @Input() columnsForAddingFn: (availableColumns: ColumnConfig[]) => any[] = (id) => id
  @Input() set language(language: string) {
    this.i18nService.language = language;
  }
  @Input() initialSortColumn: string;

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() visibleColumnsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();

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
    @Inject('tabledefaultValues') defaults: TableDefaultValues,
  ) {
    this.reorderingEnabled =  defaults.reorderingEnabled;
    this.sortingEnabled =  defaults.sortingEnabled;
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

  onRowClicked(rowClickEvent: number) {
    this.rowClick.emit(rowClickEvent);
  }

  onSortColumn(sortEvent: [string, string]) {
    this.sortColumn.emit(sortEvent);
    this.sortRows(sortEvent);
  }

  onAddingColumn(index: number) {
    this.addingColumnIndex = index;
  }

  sortRows(sortEvent: [string, string]) {
    let [property, direction] = sortEvent;
    this.rows = this.tableSortingService.sort(
      this.rows, this.columnsLookup[property], direction
    );
    this.sortedColumnName = property;
  }

  initialSort() {
    if (!this.initialSortColumn || !this.rows) {
      return;
    }
    let columnName = this.initialSortColumn.slice(1);
    let sortDirection: string;
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
      columnState.currentSortDirection = sortDirection;
      // initial sort
      this.sortRows([columnName, sortDirection]);
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
