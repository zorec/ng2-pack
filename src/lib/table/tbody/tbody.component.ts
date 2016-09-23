import {IwColumnConfigLookup} from './../table.component';
import {IwColumnConfig} from './../table.component';
import {RowClickEvent} from './../table.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[iw-body], [iwBody]',
  templateUrl: './tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class IwTbodyComponent implements OnInit {
  @Input() rows: any[];
  @Input() columnsConfig: IwColumnConfig[] = [];
  @Input() columnsConfigLookup: IwColumnConfigLookup;
  @Input() visibleColumns: string[] = [];
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();

  constructor() { }

  ngOnInit() {
  }

  onRowClicked(row: any, index: number) {
    this.rowClick.emit({
      row,
      index
    });
  }

}
