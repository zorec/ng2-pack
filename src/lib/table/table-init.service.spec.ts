/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TableInitService } from './table-init.service';

describe('Service: TableInit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableInitService]
    });
  });

  it('should ...', inject([TableInitService], (service: TableInitService) => {
    expect(service).toBeTruthy();
  }));
});
