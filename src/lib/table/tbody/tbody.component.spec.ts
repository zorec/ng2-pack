import {TableComponent} from './../table.component';
import { TbodyComponent } from './tbody.component';
/* tslint:disable:no-unused-variable */

import {ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: Tbody', () => {
  it('should create an instance', () => {
    let component = new TbodyComponent(<ElementRef>{}, <TableComponent>{});
    expect(component).toBeTruthy();
  });
});
