import { TableModule } from './../../table.module';
import { SortColumnEvent } from './../../events';
import {ColumnState} from './../../column-state.class';
import {TableComponent} from './../../table.component';
import { ThComponent } from './th.component';
/* tslint:disable:no-unused-variable */
/* tslint:global:describe,beforeEach,it */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('Component: Th', () => {
  let fixture: ComponentFixture<ThComponent>;
  let component: ThComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule]
    });
    fixture = TestBed.createComponent(ThComponent);
    component = fixture.componentInstance;
    component.tableStateService.columnsLookup = {};
    component.tableStateService.rows = [];
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onSortColumn', () => {
    beforeEach(() => {
      component.rowsSortingMode = 'default';
      component.tableStateService.rows = [];
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
      component.tableStateService.columnsLookup['foo'] = columnState;
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
      component.tableStateService.columnsLookup['foo'] = columnState;
      component.onSortColumn(columnState);
      expect(column).toEqual('foo');
      expect(direction).toEqual('desc');
    });
  });
});
