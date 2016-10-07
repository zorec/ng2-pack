import {ColumnConfig} from './../lib/table/table.component';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

const today: Date = new Date();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent {
  constructor(private datePipe: DatePipe) {

  }

  title = 'Data Table';
  columnsConfig: ColumnConfig[] = [
    {id: 'name', sortType: 'alpha'},
    {id: 'children', sortType: 'num'},
    {
      id: 'birthday',
      sortType: 'num',
      formatters: [
        {
          transform: (value: any, format: string) => this.datePipe.transform(value, format),
          arguments: ['dd.MM.y']
        }
      ],
    },
    {
      id: 'studies',
      sortingDisabled: true,
      subFields: [{id: 'university', isVisible: true}]}
  ];
  visibleColumns = ['name', 'birthday'];
  rows = [
    {
      name: 'John',
      children: 0,
      birthday: this.datePipe.transform(today.setDate(today.getDate() - 23)),
      // studies: [
      //   {university: 'FIT VUT'},
      //   {university: 'FI TUM'}
      // ]
    },
    {
      name: 'Hellen',
      children: 2,
      birthday: this.datePipe.transform(today.getDate() - 1),
      // studies: []
    },
    {} // testing of defaults
  ];
}
