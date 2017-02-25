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

    it('uses a toggled sorting direction if none provided', () => {
      let name: string, direction: string;
      component.sortColumn.subscribe((event: [string, string]) => {
        [name, direction] = event;
      });
      let columnState = new ColumnState({
        id: 'foo',
        initialSortDirection: 'desc'
      });
      component.onSortColumn(columnState);
      expect(name).toEqual('foo');
      expect(direction).toEqual('desc');
    });

    it('changes sort direction', () => {
      let name: string, direction: string;
      component.sortColumn.subscribe((event: [string, string]) => {
        [name, direction] = event;
      });
      let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'}, 'asc');
      component.onSortColumn(columnState);
      expect(name).toEqual('foo');
      expect(direction).toEqual('desc');
    })
  })
});
