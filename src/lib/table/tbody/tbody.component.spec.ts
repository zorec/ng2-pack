import { TableModule } from './../table.module';
import {TableInitService} from './../table-init.service';
import {TableComponent} from './../table.component';
import { TbodyComponent } from './tbody.component';
/* tslint:disable:no-unused-variable */

import {ElementRef} from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';

describe('Component: Tbody', () => {
  let component: TbodyComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule],
    });
    component = TestBed.createComponent(TbodyComponent).componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
