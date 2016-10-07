import {TableComponent, ColumnConfig, ColumnLookup} from './../table.component';
import {ColumnState} from './../column-state.class';

import {
  ElementRef,
  EventEmitter,
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[iw-thead]',
  templateUrl: './thead.component.html',
  styleUrls: ['./thead.component.scss']
})
export class TheadComponent implements OnInit {
  // NOTE: use immutable arrays
  // @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();

  // FIXME: use iw-table
  // @ViewChild('tableWrap') tableWrap: ElementRef;
  public lastColumnComboboxActive: boolean = false;
  public addingColumnIndex: number | null;
  public sortedColumnName: string | null;
  public draggedColumnId: string | null;

  constructor(
    private tableComponent: TableComponent,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef // needed to trigger change detection on jquery ui's callbacks
  ) {}

  ngOnInit() {
    if (this.reorderingEnabled) {
      this.initializeSortable();
    }
  }

  get columnsConfig(): ColumnConfig[] {
    return this.tableComponent.columnsConfig;
  }

  get visibleColumns(): string[] {
    return this.tableComponent.visibleColumns;
  }

  get reorderingEnabled(): boolean {
    return this.tableComponent.reorderingEnabled;
  }

  // TODO: implement disabling
  get hasAllColumnsVisble(): boolean {
    return false; // this.tableColumnService.hasAllColumnsVisible();
  }

  get isLastAddingColumnVisible() {
    return this.lastColumnComboboxActive || this.addingColumnIndex === this.visibleColumns.length;
  }

  column(columnName: string): ColumnState {
    return this.tableComponent.columnsLookup[columnName];
  }

  onSortColumn(sortEvent: string[]) {
    [this.sortedColumnName] = sortEvent;
    this.sortColumn.emit(sortEvent);
  }

  toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) { return; }
    // setTimeout(() => {
    //   jQuery(this.tableWrap.nativeElement).scrollLeft(99999);
    // }, 0);
  }

  selectNewColumn(item: {value: string}, atPosition: number) {
    this.addingColumnIndex = null;
    this.lastColumnComboboxActive = false;

    if (typeof atPosition !== 'undefined') {
      // the order changed
      this.visibleColumns.splice(atPosition, 0, item.value);
    } else {
      this.visibleColumns.push(item.value);
    }
    this.addColumn.emit(item.value);
    // this.visibleColumnsOutput.emit(this.visibleColumns);
  }

  onAddCombobox(index: number) {
    this.lastColumnComboboxActive = false;
    this.addingColumnIndex = index;
    this.addingColumn.emit(index);
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
        this.tableComponent.visibleColumns = sortedIDs;
        this.reorderColumns.emit(sortedIDs);
        this.changeDetectorRef.detectChanges();
      },
      // NOTE: provided additional information about dragging
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
}
