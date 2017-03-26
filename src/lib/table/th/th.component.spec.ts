import { SortColumnEvent } from './../events';
import {ColumnState} from './../column-state.class';
import {TableComponent} from './../table.component';
import { ThComponent } from './th.component';
/* tslint:disable:no-unused-variable */
/* tslint:global:describe,beforeEach,it */

import { TestBed, async } from '@angular/core/testing';

describe('Component: Th', () => {
  let component: ThComponent;

  beforeEach(() => {
    component = new ThComponent(<TableComponent>{});
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onSortColumn', () => {
    beforeEach(() => {
     component.rowsSortingMode = 'default';
    });

    it('does not trigger the event when disabled', () => {
      component.rowsSortingMode = 'disabled';
      let isEventTriggered: boolean = false;
      component.sortColumn.subscribe(() => {
        isEventTriggered = true;
      });
      component.onSortColumn(new ColumnState({id: 'foo'}));
      expect(isEventTriggered).toBe(false);
    });

    it('uses a toggled sorting direction if none provided', () => {
      let column: string, direction: string;
      component.sortColumn.subscribe((event: SortColumnEvent) => {
        ({column, direction} = event);
      });
      let columnState = new ColumnState({
        id: 'foo',
        initialSortDirection: 'desc'
      });
      component.onSortColumn(columnState);
      expect(column).toEqual('foo');
      expect(direction).toEqual('desc');
    });

    it('changes sort direction', () => {
      let column: string, direction: string;
      component.sortColumn.subscribe((event: SortColumnEvent) => {
        ({column, direction} = event);
      });
      let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'}, 'asc');
      component.onSortColumn(columnState);
      expect(column).toEqual('foo');
      expect(direction).toEqual('desc');
    });
  });
});
