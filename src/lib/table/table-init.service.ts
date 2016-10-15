import {ColumnState} from './column-state.class';
import {ColumnConfig, ColumnLookup, Row} from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class TableInitService {

  constructor() { }

  detectColumnConfiguration(rows: Row[]): [ColumnLookup, ColumnConfig[]] {
    let columnsLookup: ColumnLookup = {};
    //  nothing can be done without actual data
    if (typeof rows === 'undefined' || rows.length === 0) {
      return [{}, []];
    }
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
    return [columnsLookup, this.initializeColumnConfig(columnsLookup)];
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

  initializeColumnConfig(columnsLookup: ColumnLookup): ColumnConfig[] {
    let columnsConfig: ColumnConfig[] = [];
    for (let columnName in columnsLookup) {
      columnsConfig.push(columnsLookup[columnName].config);
    }
    return columnsConfig;
  }
}
