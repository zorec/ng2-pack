import { Component } from '@angular/core';
const today: Date = new Date();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  columnsConfig: [
    {id: 'name', sortType: 'alpha'},
    {id: 'children', sortType: 'num'},
    {id: 'birthday', sortType: 'num'}
  ];
  visibleColumns = ['name', 'children', 'birthday'];
  rows = [
    {name: 'John', children: 0, birthday: today.setDate(today.getDate() - 23)},
    {name: 'Hellen', children: 2, birthday: (today.getDate() - 1)},
    {} // testing of defaults
  ]
}
