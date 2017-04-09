import { TableModule } from './table.module';
import { TableStateService } from './table-state.service';
import { TableReducerService } from './table-reducer.service';
import { RowClickEvent, TableEventType } from './events';
import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {TableSortingService} from './table-sorting.service';
/* tslint:disable:no-unused-variable */
import { TableComponent } from './table.component';

import {ElementRef} from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

describe('Component: Table', () => {
  let component: TableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule],
    });
    component = TestBed.createComponent(TableComponent).componentInstance;
  });


  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('initializes visibleColumns if not provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges(null);
    expect(component.visibleColumns.length).toEqual(2);
    expect(component.visibleColumns[0]).toEqual('name');
    expect(component.visibleColumns[1]).toEqual('description');
  });

  it('visibleColumns are not overriden', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.visibleColumns = ['name'];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges(null);
    expect(component.visibleColumns.length).toEqual(1);
    expect(component.visibleColumns[0]).toEqual('name');
  });

  it('initializes columns configuration if not provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges(null);
    expect(component.columnsConfig.length).toEqual(2);
    expect(component.columnsConfig[0].id).toEqual('name');
    expect(component.columnsConfig[1].id).toEqual('description');
  });

  it('does not override provided columns configuration', () => {
    component.columnsConfig = [{id: 'foo', text: 'Foo'}];
    component.rows = [{name: 'foo', description: 'bar'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges(null);
    expect(component.columnsConfig.length).toEqual(1);
    expect(component.columnsConfig[0].text).toEqual('Foo');
    expect(component.columnsLookup['foo'].config.text).toEqual('Foo');
  });

  it('uses columns configuration if provided', () => {
    component.rows = [{name: 'foo', description: 'bar'}];
    component.columnsConfig = [{id: 'name'}];
    // trigger manually since we are running 'isolated tests'
    component.ngOnChanges(null);
    expect(component.columnsConfig.length).toEqual(1);
  });

  describe('initialSort', () => {
    beforeEach(() => {
      component.rows = [{name: 'foo', description: 'bar'}];
      component.initialSortColumn = 'name';
      component.onSortColumnInit = jasmine.createSpy('onSortColumnInit');
      component.columnsConfig = [{id: 'name'}];
    });

    it('is performed in the default mode', () => {
      component.rowsSortingMode = 'default';
      component.ngOnChanges(null);
      expect(component.onSortColumnInit).toHaveBeenCalled();
    });

    it('is performed in the external mode', () => {
      component.rowsSortingMode = 'default';
      component.ngOnChanges(null);
      expect(component.onSortColumnInit).toHaveBeenCalled();
    });

    it('does nothing if disabled', () => {
      component.rowsSortingMode = 'disabled';
      component.ngOnChanges(null);
      expect(component.onSortColumnInit).not.toHaveBeenCalled();
    });
  });
});
