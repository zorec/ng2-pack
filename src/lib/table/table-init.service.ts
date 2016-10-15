import {ColumnState} from './column-state.class';
import {ColumnConfig, ColumnLookup} from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class TableInitService {

  constructor() { }

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
}
