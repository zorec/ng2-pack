import { TableModule } from './../table.module';
import {TableInitService} from './../table-init.service';
import { HeaderRowComponent } from './header-row.component';
/* tslint:disable:no-unused-variable */

import {ChangeDetectorRef, ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: HeaderRow', () => {
  let component: HeaderRowComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule],
    });
    component = TestBed.createComponent(HeaderRowComponent).componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
