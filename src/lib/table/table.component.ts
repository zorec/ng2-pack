import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

export interface IwColumnConfig {
  id: string;
  text?: string;
  sortingDisabled?: boolean;
  sortType?: string; // either 'alpha' or 'num'
  defaultSortDirection?: string;  // either 'asc' or 'desc'
}

// contains all information about a column
export interface IwColumn {
  // config is read-only, state is stored in other properties
  config: IwColumnConfig;
  currentSortDirection?: string;
}

export interface IwColumnLookup {
  [columnName: string]: IwColumn;
}

export interface RowClickEvent {
  row: any;
  index: number;
}

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
  // TODO: is this useful?
  @Output('columnsConfig')
  columnsConfigOutput: EventEmitter<IwColumnConfig[]> = new EventEmitter<IwColumnConfig[]>();

  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  // TODO: is this useful
  public columnsLookup: IwColumnLookup;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    //  nothing can be done without actual data
    if (!this.rows && this.rows.length === 0) {
      return;
    }

    this.initializeDefaults();
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }

  onSortColumn(sortEvent: string[]) {
    let columnName: string;
    let direction: string;
    [columnName, direction] = sortEvent;
    let stringCmp = (a: string, b: string) => {
      if (typeof a === 'undefined') { return -1; }
      return a.localeCompare(b);
    }
    let cmp = stringCmp;
    if (this.columnsLookup[columnName].config.sortType === 'num') {
      let numberCmp = (a: number, b: number) => b - a;
    }
    this.rows.sort((a: any, b: any) => cmp(a[columnName], b[columnName]));
    if (direction === 'asc') {
      this.rows.reverse();
    }
  }

  private initializeDefaults() {
    this.initializeColumnConfigLookup();
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
    this.columnsConfigOutput.emit(this.columnsConfig);
  }

  private initializeColumnConfigLookup() {
    // TODO: check columnConfig first -> it's more efficient
    this.columnsLookup = {};
    this.rows.forEach(row => {
      for (let key in row) {
        if (typeof this.columnsLookup[key] === 'undefined') {
          let columnConfig = {
            id: key
          };
          this.columnsLookup[key] = {
            config: columnConfig,
          }
        }
      }
    });
  }
}
