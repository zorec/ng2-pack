import {IwColumnConfig, IwColumnConfigLookup} from './../table.component';
import { ElementRef, Component, OnInit, Input, ViewChild } from '@angular/core';

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
  // FIXME: use iw-table
  // @ViewChild('tableWrap') tableWrap: ElementRef;
  // DEBUG
  public lastColumnComboboxActive: boolean = true;

  constructor() {}

  ngOnInit() {
  }

  public toggleCombobox() {
    this.lastColumnComboboxActive = !this.lastColumnComboboxActive;
    if (!this.lastColumnComboboxActive) return;
    // setTimeout(() => {
    //   jQuery(this.tableWrap.nativeElement).scrollLeft(99999);
    // }, 0);
  }

  public showSortIcon (col: IwColumnConfig, columnEl: any, sortType: string, direction: string): boolean {
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

  // TODO: implement disabling
  public get hasAllColumnsVisble(): boolean {
    return false; // this.tableColumnService.hasAllColumnsVisible();
  }
}
