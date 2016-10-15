import {TableInitService} from './table-init.service';
import {ColumnState} from './column-state.class';
import {ColumnConfig, ColumnLookup, Row} from './types';
import {TableSortingService} from './table-sorting.service';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'iw-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // TODO: enable encapsulation again
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() rows: Row[];
  @Input() columnsConfig: ColumnConfig[];
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
    this.visibleColumnsOutput.emit(this._visibleColumns);
  }
  // NOTE: this default value should be specified in a configuration
  @Input() reorderingEnabled: boolean = true;
  @Input() sortingEnabled: boolean = true;
  @Input() inlineEditingEnabled: boolean = false;
  // @Input() columnsForAddingFn: (availableColumns: ColumnConfig[]) => any[] = (id) => id

  // TODO: is this useful? provided by service!?
  // @Output('columnsConfig') columnsConfigOutput: EventEmitter<ColumnConfig[]> = new EventEmitter<ColumnConfig[]>();

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();
  @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();

  columnsLookup: ColumnLookup;
  addingColumnIndex: number;
  customTemplate: boolean = false;

  private _visibleColumns: string[];

  constructor(
    public elementRef: ElementRef,
    public tableSortingService: TableSortingService,
    public tableInitService: TableInitService
  ) {}

  ngOnChanges() {
    this.initializeDefaults();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customTemplate = this.elementRef.nativeElement.children.length !== 1;
    });
  }

  get visibleColumns() {
    return this._visibleColumns;
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
    if (!this.sortingEnabled) { return; }
    let [property, direction] = sortEvent;
    this.rows = this.tableSortingService.sort(
      this.rows, this.columnsLookup[property], direction
    );
  }

  private initializeDefaults() {
    if (typeof this.columnsLookup === 'undefined') {
      this.initializeColumnConfigLookup();
    }
    if (typeof this.visibleColumns === 'undefined') {
      this.initializeVisibleColumns();
    }
    if (typeof this.columnsConfig === 'undefined') {
      this.initializeColumnConfig();
    }
  }

  private initializeVisibleColumns() {
    this.visibleColumns = Object.keys(this.columnsLookup);
  }

  private initializeColumnConfig() {
    this.columnsConfig = [];
    for (let columnName in this.columnsLookup) {
      this.columnsConfig.push(this.columnsLookup[columnName].config);
    }
    // this.columnsConfigOutput.emit(this.columnsConfig);
  }

  private initializeColumnConfigLookup() {
    if (typeof this.columnsConfig === 'undefined') {
      this.detectColumnConfiguration();
      return;
    }
    this.columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
  }

  private detectColumnConfiguration() {
    this.columnsLookup = {};
    //  nothing can be done without actual data
    if (typeof this.rows === 'undefined' || this.rows.length === 0) {
      return;
    }
    this.rows.forEach(row => {
      Object.keys(row).forEach(key => {
        if (typeof this.columnsLookup[key] === 'undefined') {
          let columnConfig: ColumnConfig = {
            id: key,
            sortType: typeof row[key],
            sortingDisabled: false,
            initialSortDirection: 'asc'
          };
          this.columnsLookup[key] = new ColumnState(columnConfig);
        }
      });
    });
  }
}
