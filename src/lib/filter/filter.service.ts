import { Injectable } from '@angular/core';

export interface FilterTree {
  operator: FilterOperator;
  filters: Filter[];
};

export type FilterOperator = 'and' | 'or';

export interface Filter {
  type: FilterType;
  key: string;
  // export type ObjectKeyFn = (row: any) => number;
  label?: string;
  value: any;
  options?: any[];
  filters?: Filter[];
}

export interface FilterIndex {
  [key: string]: Filter;
}

export enum FilterType {
  String,
  Enum,
  Checkbox,
  Date,
  Number,
  Object,
  Array,
  // user-defined filter-type
}

const typeToFilterType = {
  string: FilterType.String,
  number: FilterType.Number,
  boolean: FilterType.Checkbox,
};

@Injectable()
export class FilterService {

  constructor() { }

  // filterData(rows, filters: {[key: string]: any}) {
  //   const filteredRows = rows.filter((currentRow) => {
  //     return Object.keys(filters).every((key) => {
  //       return this.isRowKept(currentRow, key, filters[key]);
  //     });
  //   });
  //   return filteredRows;
  // }


  filterByTree(rows: Object[], filterTree: FilterTree): Object[] {
    if (filterTree.filters.length === 0) {
        return rows;
    }
    const filteredRows = rows.filter((row) => {
      let isKept: boolean;
      if (filterTree.operator === 'and') {
        isKept = filterTree.filters
          .filter((f) => f.value)
          .every((f) => this.isRowKept(row, f));
        return isKept;
      } else {
        // operator 'or'
        const nonEmptyFilters = filterTree.filters.filter((f) => f.value);
        return nonEmptyFilters.length === 0 || nonEmptyFilters
          .some((f) => this.isRowKept(row, f));
      }
    });
    return filteredRows;
  }


  private isRowKept(row: Object, filter: Filter) {
    console.log(row, filter);

    const key = filter.key;
    const matchValue = filter.value;
    const keyValue = (<any>row)[key];
    if (!keyValue) {
      return false;
    }
    if (filter.filters) {
      let subrows = keyValue;
      if (filter.type === FilterType.Object) {
        subrows = [keyValue];
      }
      return subrows
        .some((subrow: Object) => {
          return (filter.filters as Filter[])
            .filter((nf) => nf.value)
            .every((nf) => this.isRowKept(subrow, nf));
        });

    } else if (typeof keyValue === 'string') {
      return keyValue.toLowerCase().includes(String(matchValue).toLowerCase());
    } else {
      // tslint:disable-next-line:triple-equals
      return keyValue == matchValue;
    }
  }

  detectFilters(rows: any[], overrideFilters: FilterIndex = {}): Filter[] {
    if (!rows) {
      return [];
    }
    const filterIndex: FilterIndex = {};
    // NOTE: configure the limit
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (overrideFilters[key]) {
          filterIndex[key] = overrideFilters[key];
          return;
        }
        const value = row[key];
        const jsType = typeof value;
        let type;
        if (Array.isArray(value)) {
          type = FilterType.Array;
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          type = FilterType.Object;
        } else if (!!Date.parse(value)) {
          type = FilterType.Date;
        } else {
          type = (<any>typeToFilterType)[jsType] || FilterType.String;
        }

        filterIndex[key] = {
          type,
          key,
          value: undefined
        };
      });
    });

    const filters: Filter[] = [];
    Object.keys(filterIndex).forEach((key) => {
      filters.push(filterIndex[key]);
    });
    return filters;
  }
}
