import {TableComponent} from './table.component';
import {TheadComponent} from './thead/thead.component';
import {TbodyComponent} from './tbody/tbody.component';
import {AddColumnComponent} from './add-column/add-column.component';
import {Select2Component} from './../select2/select2.component';
import {TdComponent} from './td/td.component';
import {ThComponent} from './th/th.component';
import {DefaultValuePipe} from './../pipes/default-value/default-value.pipe';

import {TableSortingService} from './table-sorting.service';
import {TableInitService} from './table-init.service';

import { DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TableComponent,
    TheadComponent,
    TbodyComponent,
    AddColumnComponent,
    Select2Component,
    TdComponent,
    ThComponent,
    DefaultValuePipe
  ],
  exports: [
    TableComponent,
    TheadComponent,
    TbodyComponent,
    AddColumnComponent,
    Select2Component,
    TdComponent,
    ThComponent,
    DefaultValuePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DropdownModule
  ],
  providers: [
    TableSortingService,
    TableInitService,
  ]
})
export class TableModule { }
