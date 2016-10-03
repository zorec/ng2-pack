import {IwColumnConfig} from './../table.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[iw-td]',
  templateUrl: './td.component.html',
  styleUrls: ['./td.component.css']
})
export class IwTdComponent implements OnInit {
  @Input() columnConfig: IwColumnConfig;
  @Input() row: any;

  constructor() { }

  ngOnInit() {
  }

  isUndefined(value: any): boolean {
    return (typeof value === 'undefined');
  }
}
