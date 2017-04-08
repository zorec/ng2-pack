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
  SetConfigEvent,
  SortColumnEvent,
  TableEvent,
  TableEventType,
  ToggleSubfieldEvent,
} from './events';
import {ColumnState} from './column-state.class';
import { TableStateService } from './table-state.service';
import { TableReducerService } from './table-reducer.service';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {TableSortingService} from './table-sorting.service';

import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Inject,
  OnChanges,
  OpaqueToken,
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
export class TableComponent implements OnChanges {
  @Input() set rows(rows: Row[]) {
    this.tableStateService.rows = rows;
  }
  get rows() {
    return this.tableStateService.rows;
  }

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this.tableStateService.columnsConfig = columnsConfig;
    this.dispatch({
      type: TableEventType.SetConfig,
      columnsConfig
    } as SetConfigEvent);
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

  @Input() set inlineEditingEnabled(editing: boolean) {
    this.tableStateService.inlineEditingEnabled = editing;
  };
  get inlineEditingEnabled() {
    return this.tableStateService.inlineEditingEnabled;
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

  get columnsLookup(): ColumnLookup {
    return this.tableStateService.columnsLookup;
  }

  @Output() addingColumn: EventEmitter<AddingColumnEvent>;
  @Output() addColumn: EventEmitter<AddColumnAtPositionEvent>;
  @Output() removeColumn: EventEmitter<RemoveColumnEvent>;
  @Output() sortColumn: EventEmitter<SortColumnEvent>;
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent>;
  @Output() visibleColumnsChange: EventEmitter<string[]>;
  @Output() sortColumnInit: EventEmitter<void>;
  // @Output() addingColumn: EventEmitter<number>;
  @Output() rowClick: EventEmitter<RowClickEvent>;
  @Output() editCell: EventEmitter<EditCellEvent>;

  @ContentChild(TemplateRef) template: any;
  // simulate multiple elements in order to render
  // custom template with ngForTemplate
  tables = [1];

  constructor(
    private elementRef: ElementRef,
    private tableSortingService: TableSortingService,
    private tableInitService: TableInitService,
    private i18nService: I18nService,
    private tableReducerService: TableReducerService,
    private changeDetectorRef: ChangeDetectorRef,
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
    this.editCell = this.tableStateService.editCell;
  }

  ngOnChanges(arg: any) {
    this.dispatch({type: TableEventType.OnChanges});
    this.dispatch({type: TableEventType.SortColumnInit});
    if (!this.tableReducerService.skipNext) {
      this.onSortColumnInit();
    }
  }

  isSorted(column: ColumnState, direction: string) {
    return this.tableStateService.isSorted(column, direction);
  }

  onRowClicked(rowClickEvent: RowClickEvent) {
    this.rowClick.emit(rowClickEvent);
  }

  onSortColumn(sortEvent: SortColumnEvent) {
    this.sortColumn.emit(sortEvent);
  }

  onSortColumnInit() {
    this.sortColumnInit.emit();
  }

  onAddingColumn(index: number) {
    this.tableStateService.addingColumnIndex = index;
  }

  onToggleSubfield(toggleSubfieldEvent: ToggleSubfieldEvent) {
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
