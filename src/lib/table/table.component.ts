import {
  ColumnConfig,
  ColumnLookup,
  SortDirection,
  SortingMode,
  Row,
} from './types';
import {
  EditCellEvent,
  RowClickEvent,
  TableEvent,
  TableEventType,
  ToggleSubfieldEvent,
  SetConfigEvent,
  SortColumnEvent,
} from './events';
import {ColumnState} from './column-state.class';
import { TableStateService } from './table-state.service';
import { TableReducerService } from './table-reducer.service';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {TableSortingService} from './table-sorting.service';

import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Input,
  Inject,
  OnChanges,
  OnInit,
  OpaqueToken,
  Output,
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
export class TableComponent implements AfterViewInit, OnChanges, OnInit {
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

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  // @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();
  @Output() visibleColumnsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  customTemplate: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private tableSortingService: TableSortingService,
    private tableInitService: TableInitService,
    private i18nService: I18nService,
    private tableReducerService: TableReducerService,
    private changeDetectorRef: ChangeDetectorRef,
    public tableStateService: TableStateService,
  ) {
  }

  ngOnInit() {
    // this.tableReducerService.nextState.subscribe(() => {
    //   this.changeDetectorRef.markForCheck();
    //   console.log('check table service');
    // });
  }

  ngOnChanges(arg: any) {
    this.dispatch({type: TableEventType.OnChanges});
    this.dispatch({type: TableEventType.SortColumnInit});
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customTemplate = this.elementRef.nativeElement.children.length !== 1;
    });
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

  onAddingColumn(index: number) {
    this.tableStateService.addingColumnIndex = index;
  }

  onReorderColumns(reorderColumnsEvent: string[]) {
    this.reorderColumns.emit(reorderColumnsEvent);
  }

  onToggleSubfield(toggleSubfieldEvent: ToggleSubfieldEvent) {
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
