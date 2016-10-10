import {ColumnState} from './column-state.class';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  PipeTransform,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

export interface SubFieldConfig {
  id: string;
  isVisible: boolean;
}

export interface DisplayFormatter extends PipeTransform {
  arguments?: Array<any>
}

export interface ColumnConfig {
  id: string;
  text?: string;
  sortingDisabled?: boolean;
  formatters?: DisplayFormatter[];
  subFields?: SubFieldConfig[];
  category?: {
    id: string;
    text: string;
  }
  // NOTE: allow an optional compare function
  sortType?: string; // either 'string' or 'number'
  defaultSortDirection?: string;  // either 'asc' or 'desc'
}

export interface ColumnLookup {
  [columnName: string]: ColumnState;
}

type cmpFun = (a: any, b: any) => number;

export interface CompareFunctions {
  [sortType: string]: cmpFun;
}
export const sortingCompare: CompareFunctions = {
  number: (a: number, b: number): number => a - b,
  string: (a: string, b: string): number => {
    if (typeof a === 'undefined') { return -1; }
    return a.localeCompare(b);
  },
  other: (a: any, b: any): number => {
    if (a > b) { return 1; }
    if (b > a) { return -1; }
    return 0;
  }
};

@Component({
  selector: 'iw-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // TODO: enable encapsulation again
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() rows: any[];
  @Input() columnsConfig: ColumnConfig[];
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
    this.visibleColumnsOutput.emit(this._visibleColumns);
  }
  // NOTE: this default value should be specified in a configuration
  @Input() reorderingEnabled: boolean = true;
  @Input() sortingEnabled: boolean = true;
  @Input() columnsForAddingFn: (availableColumns: ColumnConfig[]) => any[] = (id) => id

  // TODO: is this useful? provided by service!?
  // @Output('columnsConfig') columnsConfigOutput: EventEmitter<ColumnConfig[]> = new EventEmitter<ColumnConfig[]>();

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();
  @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();

  columnsLookup: ColumnLookup;
  addingColumnIndex: number;
  customTemplate: boolean = false;

  private _visibleColumns: string[];

  constructor(private elementRef: ElementRef) {}

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

  onSortColumn(sortEvent: string[]) {
    if (!this.sortingEnabled) { return; }
    let [columnName, direction] = sortEvent;
    let cmp = sortingCompare[this.columnsLookup[columnName].config.sortType || 'other'];
    if (!cmp) {
      console.warn(`Unsupported sortType '${this.columnsLookup[columnName].config.sortType}' was used.` +
        'Using comparison operators: greater, less and equal (>, <, ===)'
      );
      cmp = sortingCompare['other'];
    }
    this.rows.sort((a: any, b: any) => cmp(a[columnName], b[columnName]));
    if (direction === 'desc') {
      this.rows.reverse();
    }
    this.sortColumn.emit(sortEvent);
  }

  onAddingColumn(index: number) {
    this.addingColumnIndex = index;
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
    this.columnsLookup = {};
    if (typeof this.columnsConfig === 'undefined') {
      this.detectColumnConfiguration();
      return;
    }
    this.columnsConfig.forEach((columnConfig) => {
      let activeFields: string[] = [];
      if (typeof columnConfig.subFields !== 'undefined') {
        activeFields = columnConfig.subFields
          .filter((subfield) => subfield.isVisible)
          .map((subfield) => subfield.id);
      }
      let columnState = new ColumnState(columnConfig);
      columnState.activeFields = activeFields;
      this.columnsLookup[columnConfig.id] = columnState;
    });
  }

  private detectColumnConfiguration() {
    this.columnsLookup = {};
    //  nothing can be done without actual data
    if (!this.rows && this.rows.length === 0) {
      return;
    }
    this.rows.forEach(row => {
      Object.keys(row).forEach(key => {
        if (typeof this.columnsLookup[key] === 'undefined') {
          let columnConfig: ColumnConfig = {
            id: key,
            sortType: typeof row[key],
            sortingDisabled: false,
            defaultSortDirection: 'asc'
          };
          this.columnsLookup[key] = new ColumnState(columnConfig);
        }
      });
    });
  }
}
