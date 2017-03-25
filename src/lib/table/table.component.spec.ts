import { RowClickEvent } from './events';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {TableSortingService} from './table-sorting.service';
/* tslint:disable:no-unused-variable */
import { TableComponent, tableDefaultValues } from './table.component';

import {ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: Table', () => {
  let component: TableComponent;

  beforeEach(() => {
    component = new TableComponent(
      <ElementRef>{}, new TableSortingService(),
      new TableInitService(),
      new I18nService(),
      tableDefaultValues
    );
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('initializes visibleColumns if not provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.visibleColumns.length).toEqual(2);
    expect(component.visibleColumns[0]).toEqual('name');
    expect(component.visibleColumns[1]).toEqual('description');
  });

  it('visibleColumns are not overriden', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.visibleColumns = ['name'];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.visibleColumns.length).toEqual(1);
    expect(component.visibleColumns[0]).toEqual('name');
  });

  it('initializes columns configuration if not provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.columnsConfig.length).toEqual(2);
    expect(component.columnsConfig[0].id).toEqual('name');
    expect(component.columnsConfig[1].id).toEqual('description');
  });

  it('does not override provided columns configuration', () => {
    component.columnsConfig = [{id: 'foo', text: 'Foo'}];
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.columnsConfig.length).toEqual(1);
    expect(component.columnsConfig[0].text).toEqual('Foo');
    expect(component.columnsLookup['foo'].config.text).toEqual('Foo');
  });

  it('uses columns configuration if provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.columnsConfig = [{id: 'name'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.columnsConfig.length).toEqual(1);
  });

  describe('initialSort', () => {
    beforeEach(() => {
      component.rows = [{name: 'foo', description: 'bar'}];
      component.initialSortColumn = 'name';
      component.sortRows = jasmine.createSpy('sortRows');
      component.columnsConfig = [{id: 'name'}];
    });

    it('sorts in the default mode on init', () => {
      component.rowsSortingMode = 'default';
      component.ngOnChanges();
      expect(component.sortRows).toHaveBeenCalled();
    });

    it('does not delegate to sortRows', () => {
      component.rowsSortingMode = 'external';
      component.ngOnChanges();
      expect(component.sortRows).not.toHaveBeenCalled();
    });
  });

  describe('onSortColumn', () => {
    beforeEach(() => {
      component.sortRows = jasmine.createSpy('sortRows');
    });

    it('does not trigger sorting in external mode', () => {
      component.rowsSortingMode = 'external';
      component.onSortColumn({column: 'foo', direction: 'desc'});
      expect(component.sortRows).not.toHaveBeenCalled();
    });

    it('does trigger sorting in default mode', () => {
      component.rowsSortingMode = 'default';
      component.onSortColumn({column: 'foo', direction: 'desc'});
      expect(component.sortRows).toHaveBeenCalled();
    });
  });

  describe('rowClick', () => {
    it('passes an event', () => {
      let rowIndex: number, rowObject: any;
      component.rowClick.subscribe((event: RowClickEvent) => {
        ({rowIndex, rowObject} = event);
      });
      component.onRowClicked({rowIndex: 1, rowObject: {a: 2}});
      expect(rowIndex).toBe(1);
      expect(rowObject.a).toBe(2);
    });
  });
});
