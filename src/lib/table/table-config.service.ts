import { ChangeDetectionStrategy, Injectable } from '@angular/core';

@Injectable()
export class TableConfigService {
  static strategy = ChangeDetectionStrategy.Default;

  constructor() { }

}
