import {
  ColumnConfig,
  ColumnLookup,
  Row,
  SortingMode
} from './../types';
import {
  AddColumnEvent,
  AddColumnAtPositionEvent,
  SortColumnEvent,
  ToggleSubfieldEvent,
  TableEvent,
  TableEventType,
} from '../events';
import {ColumnState} from './../column-state.class';
import {TableComponent} from './../table.component';
import { TableStateService } from './../table-state.service';
import { TableReducerService } from './../table-reducer.service';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  Optional,
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[iw-thead]',
  templateUrl: 'thead.component.html',
  styleUrls: ['./thead.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheadComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() set rows(rows: Row[]) {
    this.tableStateService.rows = rows;
  }
  get rows(): Row[] {
    return this.tableStateService.rows;
  }

  @Input() set columnsConfig(columnsConfig) {
    this.tableStateService.columnsConfig = columnsConfig;
  }
  get columnsConfig(): ColumnConfig[] {
    return this.tableStateService.columnsConfig;
  }

  @Input() set visibleColumns(visibleColumns: string[]) {
    this.tableStateService.visibleColumns = visibleColumns;
  }
  get visibleColumns(): string[] {
    return this.tableStateService.visibleColumns;
  }

  @Input() set reorderingEnabled(reordering: boolean) {
    this.tableStateService.reorderingEnabled = reordering;
  }
  get reorderingEnabled(): boolean {
    return this.tableStateService.reorderingEnabled;
  }

  @Input() set addingColumnIndex(addingIndex: number | undefined) {
    this.tableStateService.addingColumnIndex = addingIndex;
  }
  get addingColumnIndex() {
    return this.tableStateService.addingColumnIndex;
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

  get columnsLookup(): ColumnLookup {
    return this.tableStateService.columnsLookup;
  }

  get isLastAddingColumnVisible() {
    return this.lastColumnComboboxActive || this.addingColumnIndex === this.visibleColumns.length;
  }

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  lastColumnComboboxActive: boolean = false;
  draggedColumnId: string | null;
  customTemplate: boolean = false;
  tableStateService: TableStateService;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private tableReducerService: TableReducerService,
    tableStateService: TableStateService,
    @Optional() tableComponent: TableComponent
  ) {
    this.tableStateService = (tableComponent && tableComponent.tableStateService) || tableStateService;
  }

  ngOnInit() {
    this.tableReducerService.nextState.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
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

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  selectNewColumn(addColumnEvent: AddColumnEvent, atPosition: number) {
    this.lastColumnComboboxActive = false;
    this.dispatch({
      type: TableEventType.AddColumnAtPosition,
      value: addColumnEvent.value,
      atPosition,
    } as TableEvent);
    this.addColumn.emit(addColumnEvent.value);
  }

  toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) { return; }
    setTimeout(() => {
      jQuery(this.elementRef.nativeElement).scrollLeft(99999);
    }, 0);
  }

  onAddCombobox(index: number) {
    this.lastColumnComboboxActive = false;
    this.addingColumnIndex = index;
    this.addingColumn.emit(index);
  }

  onSortColumn(sortEvent: SortColumnEvent) {
    this.sortColumn.emit(sortEvent);
  }

  onToggleSubfield(toggleSubfieldEvent: ToggleSubfieldEvent) {
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  private initializeSortable() {
    jQuery(this.elementRef.nativeElement).sortable({
      cursor: 'move',
      axis: 'x',
      tolerance: 'pointer',
      items: '.drag-column',
      handle: '.col-label',
      update: () => {
        this.draggedColumnId = '';
        let sortedIDs = jQuery( this.elementRef.nativeElement )
          .sortable( 'toArray', {
            attribute: 'data-col-ref'
          });
        this.visibleColumns = sortedIDs;
        this.reorderColumns.emit(sortedIDs);
        this.changeDetectorRef.detectChanges();
      },
      // NOTE: provide additional information about dragging
      // when dragging is started
      // activate: (event: any, ui: any) => {
      //   this.draggedColumnId = ui.item.attr('data-col-ref');
      // },
      // stop: () => {
      //   this.draggedColumnId = '';
      //   this.changeDetectorRef.detectChanges();
      // }
    });
    jQuery(this.elementRef.nativeElement).disableSelection();
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
