import {
  ColumnConfig,
  ColumnLookup,
  Row,
  SortingMode
} from './../types';
import {
  AddColumnAtPositionEvent,
  AddColumnEvent,
  AddingAdjacentEvent,
  AddingColumnEvent,
  DragPreviewEvent,
  DragPreviewRevertEvent,
  DropEvent,
  RemoveColumnEvent,
  SortColumnEvent,
  ToggleSubfieldEvent,
  TableEvent,
  TableEventType,
} from '../events';
import {ColumnState} from './../column-state.class';
import {TableComponent} from './../table.component';
import { SortableEvent } from './../../sortable/sortable-item.directive';
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

  @Output() addingColumn: EventEmitter<AddingColumnEvent>;
  @Output() addColumn: EventEmitter<AddColumnAtPositionEvent>;
  @Output() removeColumn: EventEmitter<RemoveColumnEvent>;
  @Output() sortColumn: EventEmitter<SortColumnEvent>;
  @Output() sortColumnInit: EventEmitter<void>;
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent>;
  @Output() visibleColumnsChange: EventEmitter<string[]>;

  lastColumnComboboxActive: boolean = false;
  visibleColumnsBeforePreview: string[];
  tableStateService: TableStateService;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private tableReducerService: TableReducerService,
    tableStateService: TableStateService,
    @Optional() tableComponent: TableComponent
  ) {
    this.tableStateService = (tableComponent && tableComponent.tableStateService) || tableStateService;
    this.addingColumn = this.tableStateService.addingColumn;
    this.addColumn = this.tableStateService.addColumn;
    this.removeColumn = this.tableStateService.removeColumn;
    this.sortColumn = this.tableStateService.sortColumn;
    this.sortColumnInit = this.tableStateService.sortColumnInit;
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
    if (!this.tableReducerService.skipNext) {
      this.onSortColumnInit();
    }
  }

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) { return; }
    this.onAddingColumn({
      type: TableEventType.AddingColumn,
      index: this.visibleColumns.length
    });
  }

  onSelectNewColumn(addColumnEvent: AddColumnEvent, index: number | undefined) {
    this.lastColumnComboboxActive = false;
    const addColumnAtPosition: AddColumnAtPositionEvent = {
      type: TableEventType.AddColumnAtPosition,
      column: addColumnEvent.column,
      index: index || this.visibleColumns.length,
    };
    this.dispatch(addColumnAtPosition);
    this.addColumn.emit(addColumnAtPosition);
    this.visibleColumnsChange.emit(this.visibleColumns);
  }

  onAddingAdjacentColumn(index: number, addingAdjacentEvent: AddingAdjacentEvent) {
    const addingEvent: AddingColumnEvent = {
      type: TableEventType.AddingColumn,
      index: index + addingAdjacentEvent.index
    };
    this.onAddingColumn(addingEvent);
  }

  onAddingColumn(addingEvent: AddingColumnEvent) {
    this.dispatch(addingEvent);
    this.addingColumn.emit(addingEvent);
  }

  onAddingColumnEnd() {
    this.lastColumnComboboxActive = false;
    this.addingColumnIndex = undefined;
  }

  onSortColumnInit() {
    this.sortColumnInit.emit();
  }

  onDrop(sortableEvent: SortableEvent) {
    this.visibleColumnsChange.emit(this.visibleColumns);
    this.dispatch({type: TableEventType.DropColumn} as DropEvent);
  }

  onDragPreview(sortableEvent: SortableEvent) {
    const columns = sortableEvent.ids
      // slice 'col-id-' from the beggining
      .map((id: string) => id.slice(7));
    const dragPreviewEvent: DragPreviewEvent = {
      type: TableEventType.DragPreview,
      columns
    };
    this.dispatch(dragPreviewEvent);
  }

  onDragEnd() {
    this.dispatch({
      type: TableEventType.DragEnd
    } as DragPreviewRevertEvent);
  }

  onToggleSubfield(toggleSubfieldEvent: ToggleSubfieldEvent) {
    this.toggleSubfield.emit(toggleSubfieldEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
