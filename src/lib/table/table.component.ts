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
  // isSorted?: boolean; // TODO:
}

export interface IwColumnConfigLookup {
  [columnName: string]: IwColumnConfig;
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
  public columnsConfigLookup: IwColumnConfigLookup;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.rows, this.visibleColumns, this.columnsConfigLookup, this.columnsConfig);
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
    this.visibleColumns = Object.keys(this.columnsConfigLookup);
    // FIXME: emit event
  }

  private initializeColumnConfig() {
    this.columnsConfig = [];
    for (let columnName in this.columnsConfigLookup) {
      this.columnsConfig.push(this.columnsConfigLookup[columnName]);
    }
    this.columnsConfigOutput.emit(this.columnsConfig);
  }

  private initializeColumnConfigLookup() {
    // TODO: check columnConfig first -> it's more efficient
    this.columnsConfigLookup = {};
    this.rows.forEach(row => {
      for (let key in row) {
        if (typeof this.columnsConfigLookup[key] === 'undefined') {
          let columnConfig = {
            id: key
          };
          this.columnsConfigLookup[key] = columnConfig;
        }
      }
    });
  }
}
