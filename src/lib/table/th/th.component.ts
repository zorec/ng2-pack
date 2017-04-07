import {ColumnConfig, SortDirection, SortingMode} from './../types';
import {ColumnState} from './../column-state.class';
import {SortColumnEvent, ToggleSubfieldEvent} from '../events';
import {TableComponent} from './../table.component';

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
  templateUrl: 'th.component.html',
  styleUrls: ['./th.component.css']
})
export class ThComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() changeVisibility: boolean = true;
  @Input() set rowsSortingMode(rowsSortingMode: SortingMode) {
    this._rowsSortingMode = rowsSortingMode;
  };
  @Input() set visibleColumns(visibleColumns: string[]) {
    if (this.tableComponent) {
      this.tableComponent.visibleColumns = visibleColumns;
    } else {
      this._visibleColumns = visibleColumns;
    }
  };

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this._columnsConfig = columnsConfig;
  };

  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  @Output() addCombobox: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  private _rowsSortingMode: SortingMode;
  private _visibleColumns: string[];
  private _columnsConfig: ColumnConfig[];
  private tableComponent: TableComponent | undefined;

  // TODO: some properties could be taken from thead component, same for add-column.component
  constructor(@Optional() tableComponent: TableComponent) {
    this.tableComponent = tableComponent;
  }

  ngOnInit() {
  }

  get rowsSortingMode(): SortingMode {
    return this._rowsSortingMode || this.delegateInput('rowsSortingMode', <SortingMode>'default');
  }

  get visibleColumns(): string[] {
    return this._visibleColumns || this.delegateInput('visibleColumns', []);
  }

  get columnsConfig(): ColumnConfig[] {
    return this._columnsConfig || this.delegateInput('columnsConfig', []);
  }

  get hasAllColumnsVisble(): boolean {
    return this.visibleColumns.length === this.columnsConfig.length;
  }

  get isLastColumn(): boolean {
    return this.visibleColumns.length !== 1;
  }

  isSortingDisabled(column: ColumnState) {
    if (!column) { return; }
    return this.rowsSortingMode === 'disabled' || column.config.sortingDisabled;
  }

  showSortIcon (column: ColumnState, sortType: string, direction: string): boolean {
    if (!column) { return false; }
    if (this.isSortingDisabled(column)) { return false; }
    return (column.config.sortType === sortType && column.currentSortDirection === direction);
  }

  onSortColumn (column: ColumnState, direction?: string) {
    if (this.isSortingDisabled(column)) { return; }
    if (!direction) {
      direction = column.toggleDirection();
    } else {
      column.currentSortDirection = <SortDirection>direction;
    }

    this.sortColumn.emit({
      column: column.config.id,
      direction
    });
  }

  onRemoveColumn(columnName: string) {
    let columnIndex = this.visibleColumns.indexOf(columnName);
    this.visibleColumns = [
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
    } else {
      // it was active, therefore disable it
      column.activeFields.splice(subfieldIndex, 1);
    }
    this.toggleSubfield.emit({
      column: column.config.id,
      activeSubfields: column.activeFields,
      toggleSubfield: subfieldName
    });
  }

  private delegateInput<T>(propertyName: string, defaultValue: T): T {
    if (!this.tableComponent) {
      // console.warn('TheadComponent: No parent "tableComponent" was found.' +
      //   'Input "' + propertyName + '" was also not provided.');
      return defaultValue;
    }

    return (<any>this.tableComponent)[propertyName] as T;
  }
}
