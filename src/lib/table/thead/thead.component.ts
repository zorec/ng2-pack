import {IwColumnConfig, IwColumnLookup, IwColumn} from './../table.component';
import { ElementRef, EventEmitter, Component, OnInit, Input, Output, ViewChild } from '@angular/core';
const SORTABLE_COLUMNS = '.sortable-columns';
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

  @Output() visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();
  // FIXME: use iw-table
  // @ViewChild('tableWrap') tableWrap: ElementRef;
  public lastColumnComboboxActive: boolean = false;
  public currentComboboxIndex: number | null;
  public sortedColumnName: string | null;

  constructor() {}

  ngOnInit() {
  }

  column(columnName: string): IwColumn {
    return this.columnsLookup[columnName];
  }

  // TODO: implement disabling
  get hasAllColumnsVisble(): boolean {
    return false; // this.tableColumnService.hasAllColumnsVisible();
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
    this.currentComboboxIndex = null;
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
    this.currentComboboxIndex = index;
  }
}
