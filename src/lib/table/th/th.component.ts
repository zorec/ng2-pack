import {IwTableComponent, IwColumn} from './../table.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: '[iw-th]',
  templateUrl: './th.component.html',
  styleUrls: ['./th.component.css']
})
export class IwThComponent implements OnInit {
  @Input() column: IwColumn;
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private tableComponent: IwTableComponent) { }

  ngOnInit() {
  }

  get visibleColumns(): string[] {
    return this.tableComponent.visibleColumns;
  }

  onSortColumn (column: IwColumn, direction: string) {
    // if we have an explicit direction, use it
    // else if it's already sorted, then reverse the current direction
    // otherwise, use the column's preferred/default sort direction
    if (direction) {
      column.currentSortDirection = direction;
    } else if (typeof column.currentSortDirection === 'undefined') {
      column.currentSortDirection = column.config.defaultSortDirection || 'asc';
    } else {
      column.currentSortDirection = column.currentSortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn.emit([column.config.id, column.currentSortDirection]);
  }

  showSortIcon (column: IwColumn, sortType: string, direction: string): boolean {
    if (column.config.sortingDisabled) { return false; }

    // if there's no current sort direction, then use the column's preferred/default sort direction
    if (typeof column.currentSortDirection === 'undefined') {
      column.currentSortDirection = column.config.defaultSortDirection;
    }

    return (column.config.sortType === sortType && column.currentSortDirection === direction);
  }

  onRemoveColumn(columnName: string, columnIndex: number) {
    this.visibleColumns.splice(columnIndex, 1);
    this.removeColumn.emit(columnName);
  }

  onToggleSubfield(column: IwColumn, subfieldName: string) {
    let subfieldIndex = column.activeFields.indexOf(subfieldName);
    if (subfieldIndex === -1) {
      // it was not active, therefore it needs to be actived
      column.activeFields.push(subfieldName);
    } {
      // it was active, therefore disable it
      column.activeFields.splice(subfieldIndex, 1);
    }
    // TODO: emit an event
    // this.toggleSubfield.emit(columnName);
  }

}
