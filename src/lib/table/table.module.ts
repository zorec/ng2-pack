import {InsertTemplateDirective} from './custom-cell/insert-template.directive';
import {CustomCellDirective} from './custom-cell/custom-cell.directive';
import {TableComponent} from './table.component';
import {TheadComponent} from './thead/thead.component';
import {TbodyComponent} from './tbody/tbody.component';
import {AddColumnComponent} from './add-column/add-column.component';
import {Select2Component} from './../select2/select2.component';
import {TdComponent} from './td/td.component';
import {ThComponent} from './th/th.component';
import {DefaultValuePipe} from './../pipes/default-value/default-value.pipe';
import {TPipe} from './../pipes/t/t.pipe';

import {TableSortingService} from './table-sorting.service';
import {TableInitService} from './table-init.service';

import { DropdownModule} from 'ng2-dropdown';

import { CommonModule } from '@angular/common';
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
    CustomCellDirective,
    InsertTemplateDirective,
    DefaultValuePipe,
    TPipe,
  ],
  exports: [
    TableComponent,
    TheadComponent,
    TbodyComponent,
    AddColumnComponent,
    Select2Component,
    TdComponent,
    ThComponent,
    CustomCellDirective,
    DefaultValuePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  providers: [
    TableSortingService,
    TableInitService,
  ]
})
export class TableModule { }
