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
});
