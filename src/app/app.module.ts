import { PaginationModule } from './../lib/pagination/pagination.module';
import { SortableModule } from './../lib/sortable/sortable.module';
import {PipesModule} from './../lib/pipes/pipes.module';
import {TableModule} from '../lib/table/';
import {AppComponent} from './app.component';
import {StudiesCellComponent} from './table-example/studies-cell.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropdownSelectModule } from './../lib/dropdown-select/dropdown-select.module';
import { DropdownModule } from 'ngx-dropdown';

@NgModule({
  imports: [
    BrowserModule,
    TableModule,
    PaginationModule,
    DropdownModule,
    PipesModule,
    SortableModule,
    DropdownSelectModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    StudiesCellComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
