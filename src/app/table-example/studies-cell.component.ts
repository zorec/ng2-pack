import {ColumnState} from './../../lib/table';

import {Component, Input} from '@angular/core';

@Component({
  selector: 'iw-studies-cell',
  templateUrl: 'studies-cell.component.html',
})
export class StudiesCellComponent {
  @Input() row: any;
  @Input() col: ColumnState;

  constructor() {}

  isSubColumnVisible(subcolumn: string): boolean {
    return (this.col.activeFields.indexOf(subcolumn) !== -1);
  }
}
