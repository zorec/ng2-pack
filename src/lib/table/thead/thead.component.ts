import {
  ColumnConfig,
  ColumnLookup,
  Row,
  SortingMode
} from './../types';
import {
  AddColumnAtPositionEvent,
  AddColumnEvent,
  AddingColumnEvent,
  RemoveColumnEvent,
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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  Optional,
  TemplateRef,
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[iw-thead]',
  templateUrl: 'thead.component.html',
  styleUrls: ['./thead.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheadComponent implements OnChanges, OnInit {
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

  @ContentChild(TemplateRef) template: any;

  @Output() addColumn: EventEmitter<AddColumnAtPositionEvent>;
  @Output() removeColumn: EventEmitter<RemoveColumnEvent>;
  @Output() sortColumn: EventEmitter<SortColumnEvent>;
  @Output() addingColumn: EventEmitter<AddingColumnEvent>;
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent>;
  @Output() visibleColumnsChange: EventEmitter<string[]>;

  lastColumnComboboxActive: boolean = false;
  draggedColumnId: string | null;
  tableStateService: TableStateService;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private tableReducerService: TableReducerService,
    tableStateService: TableStateService,
    @Optional() tableComponent: TableComponent
  ) {
    this.tableStateService = (tableComponent && tableComponent.tableStateService) || tableStateService;
    this.addColumn = this.tableStateService.addColumn;
    this.removeColumn = this.tableStateService.removeColumn;
    this.sortColumn = this.tableStateService.sortColumn;
    this.addingColumn = this.tableStateService.addingColumn;
    this.toggleSubfield = this.tableStateService.toggleSubfield;
    this.visibleColumnsChange = this.tableStateService.visibleColumnsChange;
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

  isSorted(column: ColumnState, direction: string) {
    return this.tableStateService.isSorted(column, direction);
  }

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  selectNewColumn(addColumnEvent: AddColumnEvent, atPosition: number) {
    this.lastColumnComboboxActive = false;
    const addColumnAtPosition = {
      type: TableEventType.AddColumnAtPosition,
      value: addColumnEvent.value,
      atPosition,
    };
    this.dispatch(addColumnAtPosition);
    this.addColumn.emit(addColumnAtPosition);
    this.visibleColumnsChange.emit(this.visibleColumns);
  }

  toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) { return; }
    setTimeout(() => {
      jQuery(this.elementRef.nativeElement).scrollLeft(99999);
    }, 0);
  }

  onAddingColumn(index: number, addingEvent: AddingColumnEvent) {
    addingEvent.atPosition += index;
    this.dispatch(addingEvent);
    this.addingColumn.emit();
  }

  onAddingColumnEnd() {
    this.lastColumnComboboxActive = false;
    this.addingColumnIndex = undefined;
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
        this.visibleColumnsChange.emit(sortedIDs);
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
