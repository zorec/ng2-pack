import {ColumnState} from './column-state.class';
import { TableSortingService } from './table-sorting.service';

import { TestBed } from '@angular/core/testing';

interface TestRow {
  foo: string;
  bar?: number;
}

describe('Service: TableSortingService', () => {
  let service: TableSortingService, rows: TestRow[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableSortingService]
    });
    service = new TableSortingService();
    rows = [
      {foo: 'abc', bar: 42},
      {foo: 'zzz', bar: 0},
      {foo: 'center'}
    ];
  });

  it('sorts according to STRING property', () => {
    let columnState = new ColumnState({id: 'foo', sortType: 'string'});
    let result = <TestRow[]>service.sort(rows, columnState);
    expect(result[0].foo).toEqual('abc');
    expect(result[1].foo).toEqual('center');
    expect(result[2].foo).toEqual('zzz');
  });

  it('sorts DESCENDINGLY according to string property', () => {
    let columnState = new ColumnState({id: 'foo', sortType: 'string'}, 'desc');
    let result = <TestRow[]>service.sort(rows, columnState);
    expect(result[0].foo).toEqual('zzz');
    expect(result[1].foo).toEqual('center');
    expect(result[2].foo).toEqual('abc');
  });

  it('sorts according to NUMBER property', () => {
    let columnState = new ColumnState({id: 'bar', sortType: 'number'});
    let result = <TestRow[]>service.sort(rows, columnState);
    expect(result[0].bar).toEqual(0);
    expect(result[1].bar).toEqual(42);
    expect(result[2].bar).toEqual(undefined);
  });

  it('uses default sorting for unknown sortType', () => {
    let columnState = new ColumnState({
      id: 'bar',
      sortType: 'unknow',
    }, 'desc');
    let result = <TestRow[]>service.sort(rows, columnState);
    expect(result[0].bar).toEqual(undefined);
    expect(result[1].bar).toEqual(42);
    expect(result[2].bar).toEqual(0);
  });

  it('uses provided custom compare function', () => {
    let sortCompare = (a: number, b: number): number => {
      if (a === b) { return 0; }
      // 42 is the greatest number
      if (a === 42 || a > b) { return 1; }
      if (b === 42 || b > a) { return -1; }
    };
    let numbers = [{bar: 16}, {bar: 42}, {bar: 0}, {bar: -42}, {bar: 100}, {bar: undefined}];
    let columnState = new ColumnState({id: 'bar', sortCompare}, 'desc');
    let result = <TestRow[]>service.sort(numbers, columnState);
    expect(result[0].bar).toEqual(42);
    expect(result[1].bar).toEqual(undefined);
    expect(result[2].bar).toEqual(100);
    expect(result[3].bar).toEqual(16);
    expect(result[4].bar).toEqual(0);
    expect(result[5].bar).toEqual(-42);
  });

  describe('sets correct currentSortDirection', () => {
    it('provided direction has the highest priority', () => {
      let columnState = new ColumnState({id: 'foo'}, 'asc');
      service.sort([], columnState);
      expect(columnState.currentSortDirection).toEqual('asc');
    });

    it('uses default sort direction', () => {
      let columnState = new ColumnState({id: 'foo'});
      service.sort([], columnState);
      expect(columnState.currentSortDirection).toEqual('asc');
    });
  });

  // NOTE: test sorting stability

});
