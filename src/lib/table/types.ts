import {ColumnState} from './column-state.class';
import {PipeTransform} from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export type SortingMode = 'default' | 'external' | 'disabled';

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
  initialSortDirection?: SortDirection;  // either 'asc' or 'desc'
  data?: any; // for user-specific data
}

export interface SubFieldConfig {
  id: string;
  text: string;
  isVisible: boolean;
}

export interface ColumnLookup {
  [columnName: string]: ColumnState;
}

export type cmpFun = (a: any, b: any) => number;

export interface CompareFunctions {
  [sortType: string]: cmpFun;
}

export interface DisplayFormatter extends PipeTransform {
  arguments?: Array<any>;
}

export interface Row {
  [property: string]: any;
}
