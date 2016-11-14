import {ColumnConfig} from './../lib/table';
import {TableExampleService} from './table-example/table-example.service';

import { Component } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'iw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe, TableExampleService]
})
export class AppComponent {
  activate: boolean = false;
  title = 'Data Table';
  columnsConfig: ColumnConfig[];
  rows: any[];
  visibleColumns = ['name', 'birthday'];
  customizedFields = ['studies'];

  constructor(private tableExampleService: TableExampleService) {
    this.columnsConfig = tableExampleService.columnsConfig;
    this.rows = tableExampleService.rows.map((row) => {
      return {
        name: row.name,
        children: row.children,
        birthday: row.birthday
      };
    });
  }

  get rowsWithStudies(): any[] {
    return this.tableExampleService.rows;
  }

  isCustomField(columnId: string): boolean {
    return this.customizedFields.indexOf(columnId) !== -1;
  }
}
