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
  title = 'Data Table';
  columnsConfig: ColumnConfig[];
  rows: any[];
  visibleColumns = ['firstName', 'lastName'];
  customizedFields = ['studies'];
  actionList: string[] = []

  constructor(private tableExampleService: TableExampleService) {
    this.columnsConfig = tableExampleService.columnsConfig;
    this.rows = tableExampleService.rows
      .map((row) => {
        let copy = {
          id: row.id,
          salutation: row.salutation,
          firstName: row.firstName,
          lastName: row.lastName,
          birthday: row.birthday,
          email: row.email,
          phone: row.phone,
          country: row.country,
        };
        return copy;
      });
  }

  get rowsWithStudies(): any[] {
    return this.tableExampleService.rows;
  }

  onAction(action: string) {
    if (this.actionList.length > 3) {
      this.actionList.shift();
    }
    this.actionList.push(action);
  }

  isCustomField(columnId: string): boolean {
    return this.customizedFields.indexOf(columnId) !== -1;
  }
}
