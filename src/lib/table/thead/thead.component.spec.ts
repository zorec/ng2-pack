import { TableModule } from './../table.module';
import {TableInitService} from './../table-init.service';
import { TheadComponent } from './thead.component';
/* tslint:disable:no-unused-variable */

import {ChangeDetectorRef, ElementRef} from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

describe('Component: Thead', () => {
  let component: TheadComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule],
    });
    component = TestBed.createComponent(TheadComponent).componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
