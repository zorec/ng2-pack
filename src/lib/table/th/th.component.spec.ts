import {TableComponent} from './../table.component';
import { ThComponent } from './th.component';
/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';

describe('Component: Th', () => {
  it('should create an instance', () => {
    let component = new ThComponent(<TableComponent>{});
    expect(component).toBeTruthy();
  });
});
