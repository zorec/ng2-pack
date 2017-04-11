import { Study } from './people-mocks';
import { FormatColumnPipe } from './../../lib/table/pipes/format-column.pipe';
import { TdComponent } from './../../lib/table/td/td.component';
import {ColumnState} from './../../lib/table';

import {Component, Input} from '@angular/core';

@Component({
  selector: 'iw-studies-cell',
  templateUrl: 'studies-cell.component.html',
  providers: [
    FormatColumnPipe
  ]
})
export class StudiesCellComponent extends TdComponent {
  @Input () row: Study;
  @Input() column: ColumnState;

  isSubColumnVisible(subcolumn: string): boolean {
    return super.isSubColumnVisible(subcolumn);
  }
}
