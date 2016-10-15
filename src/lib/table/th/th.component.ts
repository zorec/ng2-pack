import {ColumnConfig} from './../types';
import {TableComponent} from './../table.component';
import {ColumnState} from './../column-state.class';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Optional,
} from '@angular/core';

@Component({
  selector: '[iw-th]',
  templateUrl: './th.component.html',
  styleUrls: ['./th.component.css']
})
export class ThComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() changeVisibility: boolean = true;
  @Input() set sortingEnabled(sortingEnabled: boolean) {
    this._sortingEnabled = sortingEnabled;
  };
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
  };

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this._columnsConfig = columnsConfig;
  };

  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleSubfield: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addCombobox: EventEmitter<number> = new EventEmitter<number>();

  private _sortingEnabled: boolean;
  private _visibleColumns: string[];
  private _columnsConfig: ColumnConfig[];

  // TODO: some properties could be taken from thead component
  constructor(@Optional() private tableComponent: TableComponent) { }

  ngOnInit() {
  }

  get sortingEnabled() {
    return this._sortingEnabled || (this.tableComponent && this.tableComponent.sortingEnabled);
  }

  get visibleColumns(): string[] {
    return this._visibleColumns || (this.tableComponent && this.tableComponent.visibleColumns);
  }

  get columnsConfig(): ColumnConfig[] {
    return this._columnsConfig || (this.tableComponent && this.tableComponent.columnsConfig);
  }

  get hasAllColumnsVisble(): boolean {
    return this.visibleColumns.length === this.columnsConfig.length;
  }

  get isLastColumn(): boolean {
    return this.visibleColumns.length !== 1;
  }

  isSortingDisabled(column: ColumnState) {
    return !this.sortingEnabled || column.config.sortingDisabled;
  }

  showSortIcon (column: ColumnState, sortType: string, direction: string): boolean {
    if (this.isSortingDisabled(column)) { return false; }
    return (column.config.sortType === sortType && column.currentSortDirection === direction);
  }

  onSortColumn (column: ColumnState, direction?: string) {
    if (this.isSortingDisabled(column)) { return; }
    this.sortColumn.emit([column.config.id, direction]);
  }

  onRemoveColumn(columnName: string) {
    let columnIndex = this.visibleColumns.indexOf(columnName);
    this.tableComponent.visibleColumns = [
      ...this.visibleColumns.slice(0, columnIndex),
      ...this.visibleColumns.slice(columnIndex + 1),
    ];
    this.removeColumn.emit(columnName);
  }

  onToggleSubfield(column: ColumnState, subfieldName: string) {
    let subfieldIndex = column.activeFields.indexOf(subfieldName);
    if (subfieldIndex === -1) {
      // it was not active, therefore it needs to be actived
      column.activeFields.push(subfieldName);
    } {
      // it was active, therefore disable it
      column.activeFields.splice(subfieldIndex, 1);
    }
    this.toggleSubfield.emit(column.config.id);
  }

}
