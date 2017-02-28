import {ColumnState} from './column-state.class';
import {ColumnConfig, ColumnLookup, Row} from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class TableInitService {

  constructor() { }

  detectColumnConfiguration(rows: Row[]): [ColumnLookup, ColumnConfig[]] {
    let columnsLookup = this.detectColumnLookup(rows);
    return [columnsLookup, this.columnsLookup2Config(columnsLookup)];
  }

  detectColumnLookup(rows: Row[]): ColumnLookup {
    let columnsLookup: ColumnLookup = {};
    rows.forEach(row => {
      Object.keys(row).forEach(key => {
        if (typeof columnsLookup[key] === 'undefined') {
          let columnConfig: ColumnConfig = {
            id: key,
            sortType: typeof row[key],
            sortingDisabled: false,
            initialSortDirection: 'asc'
          };
          columnsLookup[key] = new ColumnState(columnConfig);
        }
      });
    });
    return columnsLookup;
  }

  columnsConfig2Lookup(columnsConfig: ColumnConfig[]): ColumnLookup {
    let columnsLookup: ColumnLookup = {};
    columnsConfig.forEach((columnConfig) => {
      let activeFields: string[] = [];
      if (typeof columnConfig.subFields !== 'undefined') {
        activeFields = columnConfig.subFields
          .filter((subfield) => subfield.isVisible)
          .map((subfield) => subfield.id);
      }
      let columnState = new ColumnState(columnConfig);
      columnState.activeFields = activeFields;
      columnsLookup[columnConfig.id] = columnState;
    });

    return columnsLookup;
  }

  columnsLookup2Config(columnsLookup: ColumnLookup): ColumnConfig[] {
    let columnsConfig: ColumnConfig[] = [];
    for (let columnName in columnsLookup) {
      if (columnsLookup.hasOwnProperty(columnName)) {
        columnsConfig.push(columnsLookup[columnName].config);
      }
    }

    return columnsConfig;
  }
}
