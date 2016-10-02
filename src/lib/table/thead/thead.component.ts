import {IwColumnConfig, IwColumnLookup, IwColumn} from './../table.component';
import {
  ElementRef,
  EventEmitter,
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[iw-thead], [iwThead]',
  templateUrl: './thead.component.html',
  styleUrls: ['./thead.component.scss']
})
export class IwTheadComponent implements OnInit {
  @Input() columnsConfig: IwColumnConfig[];
  @Input() columnsLookup: IwColumnLookup;
  @Input() visibleColumns: string[];

  // NOTE: use immutable arrays
  @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();
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
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef // needed to trigger change detection on jquery ui's callbacks
  ) {}

  ngOnInit() {
    this.initializeSortable();
  }

  column(columnName: string): IwColumn {
    return this.columnsLookup[columnName];
  }

  // TODO: implement disabling
  get hasAllColumnsVisble(): boolean {
    return false; // this.tableColumnService.hasAllColumnsVisible();
  }

  get isLastAddingColumnVisible() {
    return this.lastColumnComboboxActive || this.addingColumnIndex === this.visibleColumns.length;
  }

  toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) return;
    // setTimeout(() => {
    //   jQuery(this.tableWrap.nativeElement).scrollLeft(99999);
    // }, 0);
  }

  showSortIcon (column: IwColumn, sortType: string, direction: string): boolean {
    if (column.config.sortingDisabled) { return false; }

    // if there's no current sort direction, then use the column's preferred/default sort direction
    if (typeof column.currentSortDirection === 'undefined') {
      column.currentSortDirection = column.config.defaultSortDirection;
    }

    return (column.config.sortType === sortType && column.currentSortDirection === direction);
  }

  onSortColumn (column: IwColumn, direction: string) {
    // if we have an explicit direction, use it
    // else if it's already sorted, then reverse the current direction
    // otherwise, use the column's preferred/default sort direction
    if (direction) {
      column.currentSortDirection = direction;
    } else if (this.sortedColumnName === column.config.id) {
      column.currentSortDirection = column.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      column.currentSortDirection = column.config.defaultSortDirection || 'asc';
    }
    this.sortedColumnName = column.config.id;
    this.sortColumn.emit([this.sortedColumnName, column.currentSortDirection]);
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
    this.visibleColumnsOutput.emit(this.visibleColumns);
  }

  onRemoveColumn(columnName: string, columnIndex: number) {
    this.visibleColumns.splice(columnIndex, 1);
    this.removeColumn.emit(columnName);
  }

  addCombobox(index: number) {
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
        console.log(sortedIDs)
        this.visibleColumns = sortedIDs;
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
