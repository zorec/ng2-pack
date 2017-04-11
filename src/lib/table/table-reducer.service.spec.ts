import { DatePipe } from '@angular/common';
import { ColumnState } from './column-state.class';
import { TableEvent, TableEventType } from './events';
import { TableSortingService } from './table-sorting.service';
import { TableStateService } from './table-state.service';
import { TableInitService } from './table-init.service';
import { TestBed, inject } from '@angular/core/testing';

import { TableReducerService } from './table-reducer.service';

describe('TableReducerService', () => {
  let service: TableReducerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TableInitService,
        TableReducerService,
        TableSortingService,
        DatePipe
      ]
    });
  });

  beforeEach(inject([TableReducerService], (tableReducerService: TableReducerService) => {
    service = tableReducerService;
  }));

  it('should be injected', () => {
    expect(service).toBeTruthy();
  });

  describe('sortColumn', () => {
    let state: TableStateService;
    let columnState: ColumnState;

    beforeEach(() => {
      columnState = new ColumnState({id: 'foo'});
      state = new TableStateService();
      state.columnsLookup = {
        foo: columnState
      };
      state.rows = [{foo: 'c'}, {foo: 'a'}, {foo: 'b'}];
    });

    it('does not trigger sorting in disabled mode', () => {
      state.rowsSortingMode = 'disabled';
      service.sortColumn(state, {
        type: TableEventType.SortColumn,
        column: 'foo',
        columnState,
        direction: 'desc'
      });
      expect(state.sortedColumnName).not.toEqual('foo');
    });

    it('does trigger sorting in external mode', () => {
      state.rowsSortingMode = 'external';
      service.sortColumn(state, {
        type: TableEventType.SortColumn,
        column: 'foo',
        columnState,
        direction: 'desc'
      });
      expect(state.sortedColumnName).toEqual('foo');
      // does not sort
      expect(state.rows).toEqual([
        {foo: 'c'}, {foo: 'a'}, {foo: 'b'}
      ]);
    });

    it('does trigger sorting in default mode', () => {
      state.rowsSortingMode = 'default';
      service.sortColumn(state, {
        type: TableEventType.SortColumn,
        column: 'foo',
        columnState,
        direction: 'desc'
      });
      expect(state.sortedColumnName).toEqual('foo');
      expect(state.rows).toEqual([
        {foo: 'c'}, {foo: 'b'}, {foo: 'a'}
      ]);
    });
  });
});
