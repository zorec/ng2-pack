import { TableModule } from './table.module';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TableInitService } from './table-init.service';

describe('Service: TableInit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule]
    });
  });

  it('should ...', inject([TableInitService], (service: TableInitService) => {
    expect(service).toBeTruthy();
  }));
});
