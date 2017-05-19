import { TestBed, inject } from '@angular/core/testing';

import { TableConfigService } from './table-config.service';

describe('TableConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableConfigService]
    });
  });

  it('should be created', inject([TableConfigService], (service: TableConfigService) => {
    expect(service).toBeTruthy();
  }));
});
