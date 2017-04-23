import { TableEvent, TableEventType } from './../lib/table/events';
import { TableSortingService } from './../lib/table/table-sorting.service';
import { PaginationComponent } from './../lib/table-extension/pagination/pagination.component';
import {ColumnConfig, SortColumnEvent} from './../lib/table';
import {TableExampleService} from './table-example/table-example.service';

import { Component, ViewChild } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'iw-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe, TableExampleService]
})
export class AppComponent {
  title = 'Data Table';
  columnsConfig: ColumnConfig[];
  rows: any[];
  paginatedRows: any[];
  visibleColumns = ['salutation', 'firstName', 'lastName', 'email'];
  customizedFields = ['studies'];
  actionList: string[] = [];

  demoExamples = [
    {id: 'simple', text: '1. Simple usage'},
    {id: 'all-options', text: '2. Simple usage with small adjustments.'},
    {id: 'extension', text: '3. Table extensions'},
    {id: 'custom-template', text: '4. Custom template'},
  ];
  active = 'simple';


  private pageStart = 0;
  private pageEnd = 10;

  constructor(
    private tableExampleService: TableExampleService,
    private tableSortingService: TableSortingService) {
    this.columnsConfig = tableExampleService.columnsConfig;
    this.rows = tableExampleService.rows;
    this.onPageChange(this.pageStart, this.pageEnd);
  }

  onAction(tableEvent: TableEvent, description: string) {
    if (tableEvent) {
      console.log(TableEventType[tableEvent.type], tableEvent);
    }
    if (this.actionList.length > 3) {
      this.actionList.shift();
    }
    this.actionList.push(description);
  }

  isCustomField(columnId: string): boolean {
    return this.customizedFields.indexOf(columnId) !== -1;
  }

  onPageChange(pageStart: number, pageEnd: number) {
    this.paginatedRows = this.rows.slice(pageStart, pageEnd);
  }

  onSortColumn(sortColumnEvent: SortColumnEvent) {
    this.tableSortingService.sort(this.rows, sortColumnEvent.columnState);
    this.onPageChange(this.pageStart, this.pageEnd);
  }
}
