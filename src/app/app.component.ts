import {IwColumnConfig} from './../lib/table/table.component';
import { Component } from '@angular/core';
const today: Date = new Date();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  columnsConfig: IwColumnConfig[] = [
    {id: 'name', sortType: 'alpha'},
    {id: 'children', sortType: 'num'},
    {id: 'birthday', sortType: 'num'},
    {id: 'studies', subFields: [{id: 'university', isVisible: true}]}
  ];
  visibleColumns = ['name', 'children', 'studies'];
  rows = [
    {
      name: 'John',
      children: 0,
      birthday: today.setDate(today.getDate() - 23),
      studies: [
        {university: 'FIT VUT'},
        {university: 'FI TUM'}
      ]
    },
    {
      name: 'Hellen',
      children: 2,
      birthday: (today.getDate() - 1),
      studies: []
    },
    {} // testing of defaults
  ];
}
