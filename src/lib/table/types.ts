import {ColumnState} from './column-state.class';
import {PipeTransform} from '@angular/core';

export interface ColumnConfig {
  id: string;
  text?: string;
  sortingDisabled?: boolean;
  formatters?: DisplayFormatter[];
  subFields?: SubFieldConfig[];
  category?: {
    id: string;
    text: string;
  };
  sortCompare?: (a: any, b: any) => number;
  sortType?: string; // either 'string' or 'number'
  initialSortDirection?: string;  // either 'asc' or 'desc'
}

export interface SubFieldConfig {
  id: string;
  isVisible: boolean;
}

export interface ColumnLookup {
  [columnName: string]: ColumnState;
}

type cmpFun = (a: any, b: any) => number;

export interface CompareFunctions {
  [sortType: string]: cmpFun;
}

export interface DisplayFormatter extends PipeTransform {
  arguments?: Array<any>;
}
