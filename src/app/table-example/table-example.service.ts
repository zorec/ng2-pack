import { ColumnConfig } from './../../lib/table/types';
import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import {people} from './people-mocks';


@Injectable()
export class TableExampleService {
  rows: any[] = people;

  categories = {
    person: {id: 'person', text: 'Person'},
    contact: {id: 'contact', text: 'Contact'},
  };

  columnsConfig: ColumnConfig[] = [
    {id: 'salutation', sortType: 'string', category: this.categories.person},
    {id: 'firstName', sortType: 'string', category: this.categories.person},
    {id: 'lastName', sortType: 'string', category: this.categories.person},
    {
      id: 'birthday',
      sortType: 'number',
      category: this.categories.person,
      formatters: [
        this.datePipe
      ]
    },
    {id: 'email', sortType: 'string', category: this.categories.contact},
    {id: 'phone', sortType: 'string', category: this.categories.contact},
    {
      id: 'address',
      sortingDisabled: true,
      category: this.categories.contact,
      subFields: [
        {id: 'street', text: 'Street', isVisible: true},
        {id: 'city', text: 'City', isVisible: true},
        {id: 'country', text: 'Country', isVisible: true},
      ]
    },
    {
      id: 'studies',
      sortingDisabled: true,
      subFields: [
        {id: 'university', text: 'University', isVisible: true},
        {id: 'faculty', text: 'Faculty', isVisible: true},
        {id: 'degree', text: 'Degree', isVisible: false},
        {
          id: 'finished',
          text: 'Finished',
          isVisible: true,
          formatters: [{transform: (isFinshed) => isFinshed ? 'Finished' : ''}]
        }
      ]}
  ];
  constructor(private datePipe: DatePipe) {
  }
}
