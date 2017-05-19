import { DatePipe } from '@angular/common';
import {ColumnState} from './column-state.class';
import { ColumnConfig, ColumnLookup, Row, SubFieldConfig, DisplayFormatter } from './types';
import { Injectable } from '@angular/core';

const MAX_DETECT_COUNT = 1;

export interface Initializable {
  detectColumnConfiguration(rows: Row[]): [ColumnLookup, ColumnConfig[]];
  columnsConfig2Lookup(columnsConfig: ColumnConfig[]): ColumnLookup;
}


@Injectable()
export class TableInitService implements Initializable {

  constructor(private datePipe: DatePipe) { }

  detectColumnConfiguration(rows: Row[]): [ColumnLookup, ColumnConfig[]] {
    let columnsLookup = this.detectColumnLookup(rows);
    return [columnsLookup, this.columnsLookup2Config(columnsLookup)];
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

  private detectColumnLookup(rows: Row[]): ColumnLookup {
    let columnsLookup: ColumnLookup = {};
    rows.forEach((row, index) => {
      if (index >= MAX_DETECT_COUNT) {
        return columnsLookup;
      }

      Object.keys(row).forEach((key) => {
        let previousConfig = (columnsLookup[key] && columnsLookup[key].config);
        let columnConfig = previousConfig || {
          id: key,
          sortingDisabled: true,
        };
        let activeFields: string[] = [];
        if (typeof row[key] === 'undefined' || row[key] === null) {
          // use default
        } else if (typeof row[key] === 'object' && !(row[key] instanceof Date)) {
          let obj = row[key];
          if (Array.isArray(obj)) {
            obj = row[key][0] || {};
          }
          columnConfig.subFields = [];
          Object.keys(obj).forEach((subkey) => {
            let subfield = this.detectColumnConfigFromValue(subkey, obj[subkey]);
            columnConfig.subFields!.push({
              id: subfield.id,
              text: subfield.text || subfield.id,
              isVisible: true,
              formatters: subfield.formatters,
            });
            activeFields.push(subkey);
          });
        } else {
          // NOTE: only certain fields could be overriden
          columnConfig = this.detectColumnConfigFromValue(key, row[key]);
        }

        columnsLookup[key] = new ColumnState(columnConfig, undefined, activeFields);
      });
    });
    return columnsLookup;
  }

  private columnsLookup2Config(columnsLookup: ColumnLookup): ColumnConfig[] {
    let columnsConfig: ColumnConfig[] = [];
    for (let columnName in columnsLookup) {
      if (columnsLookup.hasOwnProperty(columnName)) {
        columnsConfig.push(columnsLookup[columnName].config);
      }
    }

    return columnsConfig;
  }

  private detectColumnConfigFromValue(key: string, value: any): ColumnConfig {
    let sortType = typeof value;
    let formatters: DisplayFormatter[] = [];
    if (value instanceof Date) {
      sortType = 'number';
      formatters = [
        this.datePipe
      ];
    }
    const sortingDisabled = ['number', 'string'].indexOf(sortType) < 0;
    return {
      id: key,
      sortType,
      sortingDisabled,
      formatters: formatters,
      initialSortDirection: 'asc'
    };
  }
}
