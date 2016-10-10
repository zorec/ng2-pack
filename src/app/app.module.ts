import {StudiesCellComponent} from './table-example/studies-cell.component';
import {AppComponent} from './app.component';
import {TableModule} from '../lib/table/table.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule,
    TableModule,
  ],
  declarations: [
    AppComponent,
    StudiesCellComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
