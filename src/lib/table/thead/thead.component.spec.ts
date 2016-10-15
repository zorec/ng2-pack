import {TableInitService} from './../table-init.service';
import {TableComponent} from './../table.component';
import { TheadComponent } from './thead.component';
/* tslint:disable:no-unused-variable */

import {ChangeDetectorRef, ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: Thead', () => {
  it('should create an instance', () => {
    let component = new TheadComponent(
      <ElementRef>{},
      <ChangeDetectorRef>{},
      new TableInitService(),
      <TableComponent>{}
    );
    expect(component).toBeTruthy();
  });
});
