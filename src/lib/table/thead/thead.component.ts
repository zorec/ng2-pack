import {ColumnConfig, ColumnLookup} from './../types';
import { SortColumnEvent, ToggleSubfieldEvent} from '../events';
import {ColumnState} from './../column-state.class';
import {TableComponent} from './../table.component';
import {TableInitService} from '../table-init.service';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Optional,
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[iw-thead]',
  templateUrl: 'thead.component.html',
  styleUrls: ['./thead.component.css']
})
export class TheadComponent implements OnInit, AfterViewInit {
  @Input() set columnsConfig(columnsConfig) {
    if (this.tableComponent) {
      this.tableComponent.columnsConfig = columnsConfig;
    } else {
      this._columnsConfig = columnsConfig;
    }
  }
  @Input() set visibleColumns(visibleColumns: string[]) {
    if (this.tableComponent) {
      this.tableComponent.visibleColumns = visibleColumns;
    } else {
      this._visibleColumns = visibleColumns;
      // NOTE: what about output events?
    }
  }

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<SortColumnEvent> = new EventEmitter<SortColumnEvent>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() toggleSubfield: EventEmitter<ToggleSubfieldEvent> = new EventEmitter<ToggleSubfieldEvent>();

  lastColumnComboboxActive: boolean = false;
  addingColumnIndex: number | null;
  draggedColumnId: string | null;
  customTemplate: boolean = false;

  private _columnsConfig: ColumnConfig[];
  private _visibleColumns: string[];
  private _reorderingEnabled: boolean;
  private _columnsLookup: ColumnLookup;
  private tableComponent: TableComponent | undefined;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef, // needed to trigger change detection on jquery ui's callbacks
    private tableInitService: TableInitService,
    @Optional() tableComponent: TableComponent
  ) {
    this.tableComponent = tableComponent;
  }

  get changeColumnVisibility(): boolean {
    if (!this.tableComponent) { return false; }
    return this.tableComponent.changeColumnVisibility;
  }

  ngOnInit() {
    if (this.reorderingEnabled) {
      this.initializeSortable();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customTemplate = this.elementRef.nativeElement.children.length !== 1;
    });
  }

  get columnsConfig(): ColumnConfig[] {
    return this._columnsConfig || this.delegateInput('columnsConfig', []);
  }

  get columnsLookup(): ColumnLookup {
    let columnsLookup = this._columnsLookup ||
      (this.tableComponent && this.tableComponent.columnsLookup);
    if (typeof columnsLookup === 'undefined') {
      columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
      this._columnsLookup = columnsLookup;
    }
    return columnsLookup;
  }

  get visibleColumns(): string[] {
    return this._visibleColumns || this.delegateInput('visibleColumns', []);
  }

  get reorderingEnabled(): boolean {
    return this._reorderingEnabled || this.delegateInput('reorderingEnabled', false);
  }

  get isLastAddingColumnVisible() {
    return this.lastColumnComboboxActive || this.addingColumnIndex === this.visibleColumns.length;
  }

  isSorted(column: ColumnState, direction: string) {
    if (!this.tableComponent) { return false; }
    return this.tableComponent.isSorted(column, direction);
  }

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  selectNewColumn(item: {value: string}, atPosition: number) {
    this.addingColumnIndex = null;
    this.lastColumnComboboxActive = false;

    if (typeof atPosition !== 'undefined') {
      // the order changed
      this.visibleColumns = [
        ...this.visibleColumns.slice(0, atPosition),
        item.value,
        ...this.visibleColumns.slice(atPosition),
      ];
    } else {
      this.visibleColumns = [...this.visibleColumns, item.value];
    }
    this.addColumn.emit(item.value);
    // this.visibleColumnsOutput.emit(this.visibleColumns);
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
    if (this.tableComponent) { this.tableComponent.sortedColumnName = sortEvent.column; }
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

  private delegateInput<T>(propertyName: string, defaultValue: T): T {
    if (!this.tableComponent) {
      // console.warn('TheadComponent: No parent "tableComponent" was found.' +
      //   'Input "' + propertyName + '" was also not provided.');
      return defaultValue;
    }

    return (<any>this.tableComponent)[propertyName] as T;
  }
}
