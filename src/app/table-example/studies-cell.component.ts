import { Row } from './../../lib/table/types';
import { FormatColumnPipe } from './../../lib/table/pipes/format-column.pipe';
import { TdComponent } from './../../lib/table/';
import {ColumnState} from './../../lib/table';

import {Component, Input} from '@angular/core';

@Component({
  selector: 'iw-studies-cell',
  templateUrl: 'studies-cell.component.html',
  providers: [
    FormatColumnPipe
  ],
  styles: [`
    .dropdown-content {
      padding-left: 10px;
      padding-right: 4px;
    }

    .cell-list-item {
      font-size: xx-small !important;
    }
  `]
})
export class StudiesCellComponent extends TdComponent {
  @Input () row: Row;
  @Input() column: ColumnState;

  isSubColumnVisible(subcolumn: string): boolean {
    return super.isSubColumnVisible(subcolumn);
  }
}
