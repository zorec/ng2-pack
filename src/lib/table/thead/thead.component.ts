import {IwColumnConfig, IwColumnConfigLookup} from './../table.component';
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
  @Input() columnsConfigLookup: IwColumnConfigLookup;
  @Input() visibleColumns: string[];

  @Output() visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  // FIXME: use iw-table
  // @ViewChild('tableWrap') tableWrap: ElementRef;
  public lastColumnComboboxActive: boolean = false;
  public currentComboboxIndex: number;

  constructor() {}

  ngOnInit() {
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

  showSortIcon (col: IwColumnConfig, columnEl: any, sortType: string, direction: string): boolean {
    if (!col || col.sortingDisabled) { return false; }

    // if there's no current sort direction, then use the column's preferred/default sort direction
    if (typeof columnEl.currentSortDirection === 'undefined') {
      columnEl.currentSortDirection = columnEl.defaultSortDirection;
    }

    return (col.sortType === sortType && columnEl.currentSortDirection === direction);
  }

  sortColumn (col: IwColumnConfig, columnEl: any, direction: string) {
    // if we have an explicit direction, use it
    // else if it's already sorted, then reverse the current direction
    // otherwise, use the column's preferred/default sort direction
    if (direction) {
      columnEl.currentSortDirection = direction;
    } else if (columnEl.isSorted) {
      columnEl.currentSortDirection = columnEl.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      columnEl.currentSortDirection = col.defaultSortDirection;
    }

    // TODO: manage columns and rows in one service. peopleService could use tableColumns internally or vice versa
    // this.tableColumnService.sortedColumn = col;
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
