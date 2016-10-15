import {TableSortingService} from './table-sorting.service';
/* tslint:disable:no-unused-variable */
import { TableComponent } from './table.component';

import {ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: Table', () => {
  let component: TableComponent;

  beforeEach(() => {
    component = new TableComponent(<ElementRef>{}, new TableSortingService());
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


  describe('events', () => {
    it('rowClick', () => {
      component.rowClick.subscribe((event: number) => {
        expect(event).toEqual(1);
      });
      component.onRowClicked(1);
    });
  });
});
