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
    beforeEach(() => {
      state = new TableStateService();
      state.columnsLookup = {
        foo: new ColumnState({id: 'foo'})
      };
      state.rows = [];
    });

    it('does not trigger sorting in external mode', () => {
      state.rowsSortingMode = 'external';
      service.sortColumn(state, {
        type: TableEventType.SortColumn,
        column: 'foo',
        direction: 'desc'
      });
      expect(state.sortedColumnName).not.toEqual('foo');
    });

    it('does trigger sorting in default mode', () => {
      state.rowsSortingMode = 'default';
      service.sortColumn(state, {
        type: TableEventType.SortColumn,
        column: 'foo',
        direction: 'desc'
      });
      expect(state.sortedColumnName).toEqual('foo');
    });
  });
});
