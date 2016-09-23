/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { IwTableComponent, RowClickEvent } from './table.component';

describe('Component: Table', () => {
  let component: IwTableComponent;

  beforeEach(() => {
    component = new IwTableComponent();
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
    component.visibleColumns = ['name']
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

  /*
  it('initializes column configuration according to visible columns', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.visibleColumns = ['foo']
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.columnsConfig.length).toEqual(1);
    expect(component.columnsConfig[0].id).toEqual('name');
  });
  */

  it('uses columns configuration if provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.columnsConfig = [{id: 'name'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges();
    expect(component.columnsConfig.length).toEqual(1);
  });


  describe('events', () => {
    it('rowClick', () => {
      component.rowClick.subscribe((event: RowClickEvent) => {
        expect(event.row.name).toEqual('bar');
        expect(event.index).toEqual(1);
      });
      component.onRowClicked({name: 'bar'}, 1);
    });
  });
});
