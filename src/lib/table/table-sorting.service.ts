import {ColumnState} from './column-state.class';
import {CompareFunctions, Row} from './types';

import {Injectable} from '@angular/core';

export interface Sorting {
  sort(rows: Row[], columnState: ColumnState): any[];
}

export const sortingCompare: CompareFunctions = {
  number: (a: number, b: number): number => a - b,
  string: (a: string, b: string): number => {
    if (typeof a === 'undefined') { return -1; }
    return a.localeCompare(b);
  },
  other: (a: any, b: any): number => {
    if (a > b) { return 1; }
    if (b > a) { return -1; }
    return 0;
  }
};

@Injectable()
export class TableSortingService {
  sort(rows: Row[], columnState: ColumnState) {
    let sortType = columnState.config.sortType || 'other';
    let cmpFn = columnState.config.sortCompare || sortingCompare[sortType];
    if (!cmpFn) {
      console.warn(`Unsupported sorting type '${sortType}' was used. ` +
        'Using comparison operators: greater, less and equal (>, <, ===)'
      );
      cmpFn = sortingCompare['other'];
    }
    rows.sort((a: any, b: any) => cmpFn(a[columnState.config.id], b[columnState.config.id]));
    if (columnState.currentSortDirection === 'desc') {
      rows.reverse();
    }

    return rows;
  }
}
