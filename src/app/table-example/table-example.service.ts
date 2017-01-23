import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import {people} from './people-mocks';


@Injectable()
export class TableExampleService {

  rows = people;

  categories = {
    person: {id: 'person', text: 'Person'},
    contact: {id: 'contact', text: 'Contact'},
  };

  columnsConfig = [
    {id: 'salutation', sortType: 'string', category: this.categories.person},
    {id: 'firstName', sortType: 'string', category: this.categories.person},
    {id: 'lastName', sortType: 'string', category: this.categories.person},
    {id: 'email', sortType: 'string', category: this.categories.contact},
    {id: 'phone', sortType: 'string', category: this.categories.contact},
    {
      id: 'address',
      sortingDisabled: true,
      category: this.categories.contact,
      subFields: [
        {id: 'street', text: 'Street', isVisible: true},
        {id: 'city', text: 'City', isVisible: true},
      ]
    },
    {id: 'country', sortType: 'string', category: this.categories.contact},
    {
      id: 'studies',
      sortingDisabled: true,
      subFields: [
        {id: 'university', text: 'University', isVisible: true},
        {id: 'faculty', text: 'Faculty', isVisible: true},
        // {id: 'country', text: 'Country', isVisible: false}
      ]}
  ];
  constructor(private datePipe: DatePipe) {}
}
