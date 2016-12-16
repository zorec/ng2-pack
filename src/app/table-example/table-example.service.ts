import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';

const today: Date = new Date();
interface RowData {
  name?: string;
  children?: number;
  birthday?: any;
  studies?: any[];
}

@Injectable()
export class TableExampleService {

  rows: RowData[] = [
    {
      name: 'John',
      children: 0,
      birthday: this.datePipe.transform(today.setDate(today.getDate() - 23)),
      studies: [
        {university: 'VUT', faculty: 'FIT', country: 'Czech Republic'},
        {university: 'FI', faculty: 'TUM', country: 'Germany'}
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
      initialSortDirection: 'desc',
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
      subFields: [
        {id: 'university', text: 'University', isVisible: true},
        {id: 'faculty', text: 'Faculty', isVisible: true},
        {id: 'country', text: 'Country', isVisible: false}
      ]}
  ];
  constructor(private datePipe: DatePipe) {}
}
