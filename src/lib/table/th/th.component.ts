import { TableEvent, TableEventType } from './../events';
import { TableReducerService } from './../table-reducer.service';
import { TheadComponent } from './../thead/thead.component';
import { TableStateService } from './../table-state.service';
import {ColumnConfig, SortDirection, SortingMode} from './../types';
import {ColumnState} from './../column-state.class';
import {SortColumnEvent, ToggleSubfieldEvent} from '../events';
import {TableComponent} from './../table.component';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  styleUrls: ['./th.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ThComponent implements OnInit {
  @Input() column: ColumnState;

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this.tableStateService.columnsConfig = columnsConfig;
  };
  get columnsConfig(): ColumnConfig[] {
    return this.tableStateService.columnsConfig;
  }

  @Input() set visibleColumns(visibleColumns: string[]) {
    this.tableStateService.visibleColumns = visibleColumns;
  };
  get visibleColumns(): string[] {
    return this.tableStateService.visibleColumns;
  }

  @Input() set changeVisibility(visibility: boolean) {
    this.tableStateService.changeColumnVisibility = visibility;
  }
  get changeVisibility(): boolean {
    return this.tableStateService.changeColumnVisibility;
  }

  @Input() set rowsSortingMode(rowsSortingMode: SortingMode) {
    this.tableStateService.rowsSortingMode = rowsSortingMode;
  };
  get rowsSortingMode(): SortingMode {
    return this.tableStateService.rowsSortingMode;
  }

  get hasAllColumnsVisble(): boolean {
    return this.visibleColumns.length === this.columnsConfig.length;
  }

  get isLastColumn(): boolean {
    return this.visibleColumns.length !== 1;
  }

  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  @Output() addCombobox: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  tableStateService: TableStateService;
  constructor(
    tableStateService: TableStateService,
    private tableReducerService: TableReducerService,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() tableComponent: TableComponent,
    @Optional() theadComponent: TheadComponent
  ) {
    this.tableStateService = (tableComponent && tableComponent.tableStateService) ||
      (theadComponent  && theadComponent.tableStateService) || tableStateService;
  }

  ngOnInit() {
    this.tableReducerService.nextState.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
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
    const sortColumnEvent = {
      type: TableEventType.SortColumn,
      column: column.config.id,
      direction: direction || column.nextDirection()
    };
    this.dispatch(sortColumnEvent);
    this.sortColumn.emit(sortColumnEvent);
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
    const toggleSubfieldEvent = {
      type: TableEventType.ToggleSubfield,
      column: column.config.id,
      activeSubfields: column.activeFields,
      toggleSubfield: subfieldName
    };
    this.dispatch(toggleSubfieldEvent);
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
