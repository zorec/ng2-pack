import { TableExtensionModule } from './../lib/table-extension/table-extension.module';
import {InlineEditableModule} from '../lib/inline-editable/';
import {PipesModule} from './../lib/pipes/pipes.module';
import {TableModule} from '../lib/table/';
import {AppComponent} from './app.component';
import {StudiesCellComponent} from './table-example/studies-cell.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DropdownModule } from 'ngx-dropdown';

@NgModule({
  imports: [
    BrowserModule,
    TableModule,
    TableExtensionModule,
    DropdownModule,
    InlineEditableModule,
    PipesModule
  ],
  declarations: [
    AppComponent,
    StudiesCellComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
