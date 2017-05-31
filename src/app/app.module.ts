import { FiltersComponent } from './filters/filters.component';
import { FilterService } from './../lib/filter/filter.service';
import { FilterInputComponent } from './filter-input/filter-input.component';
import { PaginationModule } from './../lib/pagination/pagination.module';
import { SortableModule } from './../lib/sortable/sortable.module';
import { FilterModule } from './../lib/filter/filter.module';
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
    FormsModule,
    FilterModule
  ],
  declarations: [
    AppComponent,
    StudiesCellComponent,
    FiltersComponent,
    FilterInputComponent
  ],
  providers: [
    FilterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
