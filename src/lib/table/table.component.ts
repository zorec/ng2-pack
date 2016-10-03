import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  PipeTransform,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

export interface IwSubFieldConfig {
  id: string;
  isVisible: boolean;
}

export interface DisplayFormatter extends PipeTransform {
  arguments?: Array<any>
}

export interface IwColumnConfig {
  id: string;
  text?: string;
  sortingDisabled?: boolean;
  formatters?: DisplayFormatter[];
  subFields?: IwSubFieldConfig[];
  // NOTE: allow an optional compare function
  sortType?: string; // either 'alpha' or 'num'
  defaultSortDirection?: string;  // either 'asc' or 'desc'
}

// contains all information about a column
export interface IwColumn {
  // config is read-only, state is stored in other properties
  config: IwColumnConfig;
  currentSortDirection?: string;
  activeFields?: string[];
}

export interface IwColumnLookup {
  [columnName: string]: IwColumn;
}

export interface RowClickEvent {
  row: any;
  index: number;
}

type cmpFun = (a: any, b: any) => number;

export interface CompareFunctions {
  [sortType: string]: cmpFun;
}
export const sortingCompare: CompareFunctions = {
  num: (a: number, b: number): number => a - b,
  alpha: (a: string, b: string): number => {
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
export class IwTableComponent implements OnInit, OnChanges {
  @Input() rows: any[];
  @Input() columnsConfig: IwColumnConfig[];
  @Input() visibleColumns: string[];
  // NOTE: this default value should be specified in a configuration
  @Input() reorderingEnabled: boolean = true;
  // TODO: is this useful?
  // @Output('columnsConfig') columnsConfigOutput: EventEmitter<IwColumnConfig[]> = new EventEmitter<IwColumnConfig[]>();
  // @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  public columnsLookup: IwColumnLookup;
  public addingColumnIndex: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initializeDefaults();
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }

  onSortColumn(sortEvent: string[]) {
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
    // FIXME: emit event
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
      this.columnsLookup[columnConfig.id] = {
        config: columnConfig,
        activeFields
      };
    });
  }

  private detectColumnConfiguration() {
    this.columnsLookup = {};
    //  nothing can be done without actual data
    if (!this.rows && this.rows.length === 0) {
      return;
    }
    this.rows.forEach(row => {
      for (let key in row) {
        if (typeof this.columnsLookup[key] === 'undefined') {
          let columnConfig = {
            id: key
          };
          this.columnsLookup[key] = {
            config: columnConfig,
          };
        }
      }
    });
  }
}
