import {StudiesCellComponent} from './table-example/studies-cell.component';
import {AppComponent} from './app.component';
import {TableModule} from '../lib/table/';
import {InlineEditableModule} from '../lib/inline-editable/';
import { ActivateEventDirective } from '../lib/activate-event/';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule,
    TableModule,
    InlineEditableModule
  ],
  declarations: [
    AppComponent,
    StudiesCellComponent,
    ActivateEventDirective,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
