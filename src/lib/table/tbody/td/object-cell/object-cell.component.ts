import { TableReducerService } from './../../../table-reducer.service';
import { SubFieldConfig } from './../../../types';
import { FormatColumnPipe } from './../../../pipes/format-column.pipe';
import { TdComponent } from './../../td/td.component';

import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'iw-object-cell',
  templateUrl: './object-cell.component.html',
  styleUrls: ['./object-cell.component.css'],
  // changeDetection: TableConfigService.strategy,
  providers: [
    FormatColumnPipe
  ]
})
export class ObjectCellComponent extends TdComponent implements OnInit {
  @Input() object: Object;
  @Input() hasPrefix = false;

  get allSubfieldsHidden(): boolean {
    return this.activeFields.length === 0;
  }

  ngOnInit() {
    // this.tableReducerService.nextState.subscribe(() => {
    //   this.changeDetectorRef.markForCheck();
    // });
  }

  keyToSubcolumn(key: string): SubFieldConfig | undefined {
    return this.column.config.subFields && this.column.config.subFields
      .find(s => s.id === key);
  }

}
