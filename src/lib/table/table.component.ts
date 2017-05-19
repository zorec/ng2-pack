import {
  ColumnConfig,
  ColumnLookup,
  SortDirection,
  SortingMode,
  Row,
} from './types';
import {
  AddColumnAtPositionEvent,
  AddingColumnEvent,
  EditCellEvent,
  RowClickEvent,
  RemoveColumnEvent,
  SortColumnEvent,
  TableEvent,
  TableEventType,
  ToggleSubfieldEvent,
} from './events';
import {ColumnState} from './column-state.class';
import { TableStateService } from './table-state.service';
import { TableReducerService } from './table-reducer.service';

import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Inject,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  Renderer,
  ViewEncapsulation,
} from '@angular/core';


@Component({
  selector: 'iw-table',
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss'],
  // TODO: enable encapsulation again
  encapsulation: ViewEncapsulation.None,
  providers: [
    TableStateService,
    TableReducerService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges, OnDestroy {
  @Input() set rows(rows: Row[]) {
    this.tableStateService.rows = rows;
  }
  get rows() {
    return this.tableStateService.rows;
  }

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this.tableStateService.columnsConfig = columnsConfig;
  }
  get columnsConfig(): ColumnConfig[] {
    return this.tableStateService.columnsConfig;
  }

  @Input() set visibleColumns(visibleColumns: string[]) {
    this.tableStateService.visibleColumns = visibleColumns;
  }
  get visibleColumns() {
    return this.tableStateService.visibleColumns;
  }

  @Input() set reorderingEnabled(isEnabled: boolean) {
    this.tableStateService.reorderingEnabled = isEnabled;
  };
  get reorderingEnabled() {
    return this.tableStateService.reorderingEnabled;
  }

  @Input() set changeColumnVisibility(visibility: boolean) {
    this.tableStateService.changeColumnVisibility = visibility;
  }
  get changeColumnVisibility() {
    return this.tableStateService.changeColumnVisibility;
  }

  @Input() set rowsSortingMode(mode: SortingMode) {
    this.tableStateService.rowsSortingMode = mode;
  }
  get rowsSortingMode() {
    return this.tableStateService.rowsSortingMode;
  }

  @Input() set language(language: string) {
    this.tableStateService.language = language;
  }
  get language() {
    return this.tableStateService.language;
  }

  @Input() set initialSortColumn(column: string | undefined) {
    this.tableStateService.initialSortColumn = column;
  }
  get initialSortColumn() {
    return this.tableStateService.initialSortColumn;
  }

  // templates
  @Input() tableTemplate: any;
  // @Input() headerTemplate: any;
  // @Input() bodyTemplate: any;
  @Input() headerRowTemplate: any;
  @Input() bodyRowTemplate: any;

  get columnsLookup(): ColumnLookup {
    return this.tableStateService.columnsLookup;
  }

  @Output() addingColumn: EventEmitter<AddingColumnEvent>;
  @Output() addColumn: EventEmitter<AddColumnAtPositionEvent>;
  @Output() removeColumn: EventEmitter<RemoveColumnEvent>;
  @Output() sortColumn: EventEmitter<SortColumnEvent>;
  @Output() sortColumnInit: EventEmitter<void>;
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent>;
  @Output() visibleColumnsChange: EventEmitter<string[]>;
  @Output() rowClick: EventEmitter<RowClickEvent>;
  // @Output() editCell: EventEmitter<EditCellEvent>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public tableReducerService: TableReducerService,
    public tableStateService: TableStateService,
  ) {
    this.addColumn = this.tableStateService.addColumn;
    this.removeColumn = this.tableStateService.removeColumn;
    this.sortColumn = this.tableStateService.sortColumn;
    this.addingColumn = this.tableStateService.addingColumn;
    this.toggleSubfield = this.tableStateService.toggleSubfield;
    this.visibleColumnsChange = this.tableStateService.visibleColumnsChange;
    this.sortColumnInit = this.tableStateService.sortColumnInit;
    this.rowClick = this.tableStateService.rowClick;
    // this.editCell = this.tableStateService.editCell;
  }

  ngOnChanges(arg: any) {
    this.dispatch({type: TableEventType.OnChanges});
    this.dispatch({type: TableEventType.SortColumnInit});
    if (!this.tableReducerService.skipNext) {
      this.onSortColumnInit();
    }
  }

  ngOnDestroy() {
    this.tableReducerService.nextState.unsubscribe();
  }

  onSortColumnInit() {
    this.sortColumnInit.emit();
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
