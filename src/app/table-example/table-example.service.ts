import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';

const today: Date = new Date();
interface RowData {
  name?: string;
  children?: number;
  birthday?: any,
  studies?: any[]
}

@Injectable()
export class TableExampleService {
  constructor(private datePipe: DatePipe) {}

  rows: RowData[] = [
    {
      name: 'John',
      children: 0,
      birthday: this.datePipe.transform(today.setDate(today.getDate() - 23)),
      studies: [
        {university: 'FIT VUT'},
        {university: 'FI TUM'}
      ]
    },
    {
      name: 'Hellen',
      children: 2,
      birthday: this.datePipe.transform(today.getDate() - 1),
      studies: []
    },
    // {} // testing of defaults
  ];

  columnsConfig = [
    {id: 'name', sortType: 'string', category: {id: 'person', text: 'Person'}},
    {id: 'children', sortType: 'number', category: {id: 'person', text: 'Person'}},
    {
      id: 'birthday',
      sortType: 'number',
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
}
