import { TableReducerService } from './../../table-reducer.service';
import {ColumnState} from './../../column-state.class';
import {FormatColumnPipe} from './../../pipes/format-column.pipe';

import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: 'td.component.html',
  styleUrls: ['./td.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormatColumnPipe,
  ],
})
export class TdComponent implements OnInit {
  @Input() column: ColumnState;
  @Input() row: any;

  @ViewChild('contentDiv') contentDiv: ElementRef;

  constructor(
    protected formatColumnPipe: FormatColumnPipe,
    // protected tableReducerService: TableReducerService,
    // protected changeDetectorRef: ChangeDetectorRef
    ) {
    }

  ngOnInit() {
    // this.tableReducerService.nextState.subscribe(() => {
    //   this.changeDetectorRef.markForCheck();
    // });
  }

  get cellValue(): any {
    if (!this.column) { return; }
    return this.row[this.column.config.id];
  }

  get content(): string {
    return this.contentDiv.nativeElement.textContent;
  }

  get isChanged(): boolean {
    return this.contentDiv.nativeElement.textContent.trim() !== this.formattedValue;
  }

  get formattedValue() {
    if (!this.column) { return; }
    return this.formatColumnPipe.transform(this.cellValue, this.column);
  }

  get isArray() {
    return (this.cellValue && Array.isArray(this.cellValue));
  }

  get activeFields() {
    return this.column.activeFields;
  }

  get hasSubfields() {
    if (!this.column) { return; }
    return this.column.config.subFields && this.column.config.subFields.length > 0;
  }

  isSubColumnVisible(subcolumn: string): boolean {
    return (this.activeFields.indexOf(subcolumn) !== -1);
  }
}
