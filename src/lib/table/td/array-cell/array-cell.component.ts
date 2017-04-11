import { ColumnState } from './../../column-state.class';
import { TdComponent } from './../td.component';
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'iw-array-cell',
  templateUrl: './array-cell.component.html',
  styleUrls: ['./array-cell.component.css']
})
export class ArrayCellComponent extends TdComponent implements OnInit {
  @Input() subrows: any = [];
  @Input() column: ColumnState;
  @Input() showAll = false;
  @ContentChild(TemplateRef) template: any;

  ngOnInit() {
  }

  get hasNoSubrows(): boolean {
    return this.subrows.length === 0;
  }

  get hasMultipleSubrows(): boolean {
    return this.subrows.length > 1;
  }

  get enabledSubrows() {
    if (this.showAll) {
      return this.subrows;
    } else if (this.subrows && this.subrows.length > 0) {
      return [this.subrows[0]];
    }
    return [];
  }
}
