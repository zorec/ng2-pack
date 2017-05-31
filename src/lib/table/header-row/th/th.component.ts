import { TableConfigService } from './../../table-config.service';
import {
  AdjacentDirection,
  AddingAdjacentEvent,
  AddingColumnEvent,
  RemoveColumnEvent,
  SortColumnEvent,
  ToggleSubfieldEvent,
  TableEvent,
  TableEventType
} from './../../events';
import {ColumnConfig, SortDirection, SortingMode} from './../../types';
import { HeaderRowComponent } from '../header-row.component';
import {ColumnState} from './../../column-state.class';
import {TableComponent} from './../../table.component';
import { TableReducerService } from './../../table-reducer.service';
import { TableStateService } from './../../table-state.service';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  Optional,
} from '@angular/core';

@Component({
  selector: '[iw-th]',
  templateUrl: 'th.component.html',
  styleUrls: ['./th.component.css'],
  changeDetection: TableConfigService.strategy,

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
    return this.tableStateService.hasAllColumnsVisible;
  }

  get isLastColumn(): boolean {
    return this.visibleColumns.length !== 1;
  }

  // addingAdjacentColumn is not shared
  @Output() addingAdjacentColumn = new EventEmitter<AddingAdjacentEvent>();
  @Output() removeColumn: EventEmitter<RemoveColumnEvent>;
  @Output() sortColumn: EventEmitter<SortColumnEvent>;
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent>;
  @Output() visibleColumnsChange: EventEmitter<string[]>;

  tableStateService: TableStateService;
  constructor(
    tableStateService: TableStateService,
    public tableReducerService: TableReducerService,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() tableComponent: TableComponent,
    @Optional() headerRowComponent: HeaderRowComponent
  ) {
    this.tableStateService = (tableComponent && tableComponent.tableStateService) ||
      (headerRowComponent && headerRowComponent.tableStateService) || tableStateService;
    this.removeColumn = this.tableStateService.removeColumn;
    this.sortColumn = this.tableStateService.sortColumn;
    this.toggleSubfield = this.tableStateService.toggleSubfield;
    this.visibleColumnsChange = this.tableStateService.visibleColumnsChange;
  }

  @HostBinding('attr.id') get id() {
    if (!this.column) { return ''; }
    return `col-id-${this.column.config.id}`;
  }

  @HostBinding('class.is-sorted') get isSorted() {
    return this.tableStateService.isSorted(this.column, undefined);
  }

  @HostBinding('class.is-sorted--asc') get isSortedAsc() {
    return this.tableStateService.isSorted(this.column, undefined);
  }

  @HostBinding('class.is-sorted--desc') get isSortedDesc() {
    return this.tableStateService.isSorted(this.column, undefined);
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
    const sortColumnEvent: SortColumnEvent = {
      type: TableEventType.SortColumn,
      column: column.config.id,
      columnState: column,
      direction: direction || column.nextDirection()
    };
    this.dispatch(sortColumnEvent);
    this.sortColumn.emit(sortColumnEvent);
  }

  onRemoveColumn(columnId: string) {
    let columnIndex = this.visibleColumns.indexOf(columnId);
    const removeColumnEvent: RemoveColumnEvent = {
      type: TableEventType.RemoveColumn,
      column: columnId,
      index: columnIndex,
    };
    this.dispatch(removeColumnEvent);
    this.removeColumn.emit(removeColumnEvent);
    this.visibleColumnsChange.emit(this.visibleColumns);
  }

  onToggleSubfield(column: ColumnState, subfieldName: string) {
    const toggleSubfieldEvent: ToggleSubfieldEvent = {
      type: TableEventType.ToggleSubfield,
      column: column.config.id,
      activeSubfields: column.activeFields,
      toggleSubfield: subfieldName
    };
    this.dispatch(toggleSubfieldEvent);
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  onAddingAdjacentColumn(atPosition: AdjacentDirection) {
    if (this.hasAllColumnsVisble) {
      return;
    }

    this.addingAdjacentColumn.emit({
      type: TableEventType.AddingAdjacentColumn,
      index: atPosition,
    } as AddingAdjacentEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
