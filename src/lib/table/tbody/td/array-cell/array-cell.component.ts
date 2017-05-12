import { FormatColumnPipe } from './../../../pipes/format-column.pipe';
import { ColumnState } from './../../../column-state.class';
import { TdComponent } from './../td.component';
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'iw-array-cell',
  templateUrl: './array-cell.component.html',
  styleUrls: ['./array-cell.component.css'],
  providers: [
    FormatColumnPipe,
  ]
})
export class ArrayCellComponent extends TdComponent implements OnInit {
  @Input() subrows: any;
  @Input() column: ColumnState;
  @Input() showAll = false;
  @ContentChild(TemplateRef) template: any;

  ngOnInit() {
  }

  toggle(clickEvent: Event) {
    clickEvent.stopPropagation();
    this.showAll = !this.showAll;
  }

  isHiddenItem(index: number) {
    return index > 0 && !this.showAll;
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
