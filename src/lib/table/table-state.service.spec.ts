import { TestBed, inject } from '@angular/core/testing';

import { TableStateService } from './table-state.service';

describe('TableStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableStateService]
    });
  });

  it('should ...', inject([TableStateService], (service: TableStateService) => {
    expect(service).toBeTruthy();
  }));
});
