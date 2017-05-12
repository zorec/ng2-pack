import { TableReducerService } from './../../../table-reducer.service';
import { SubFieldConfig } from './../../../types';
import { FormatColumnPipe } from './../../../pipes/format-column.pipe';
import { TdComponent } from './../../td/td.component';

import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'iw-object-cell',
  templateUrl: './object-cell.component.html',
  styleUrls: ['./object-cell.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormatColumnPipe
  ]
})
export class ObjectCellComponent extends TdComponent implements OnInit {
  @Input() object: {[key: string]: string};
  @Input() hasPrefix = false;

  ngOnInit() {
    // this.tableReducerService.nextState.subscribe(() => {
    //   this.changeDetectorRef.markForCheck();
    // });
  }

  get allSubfieldsHidden(): boolean {
    return this.activeFields.length === 0;
  }

  keyToSubcolumn(key: string): SubFieldConfig | undefined {
    return this.column.config.subFields && this.column.config.subFields
      .find(s => s.id === key);
  }

}
