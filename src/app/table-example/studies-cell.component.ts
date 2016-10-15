import {ColumnState} from './../../lib/table';

import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-studies-cell',
  templateUrl: 'studies-cell.component.html',
})
export class StudiesCellComponent {

  constructor() {}

  @Input() row: any;
  @Input() col: ColumnState;

  isSubColumnVisible(subcolumn: string): boolean {
    return (this.col.activeFields.indexOf(subcolumn) !== -1);
  }
}
