import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IwTableComponent } from '../lib/table/table.component';
import { IwSelect2Component } from '../lib/select2/select2.component';
import { IwTheadComponent } from '../lib/table/thead/thead.component';
import { IwTbodyComponent } from '../lib/table/tbody/tbody.component';
import { IwAddColumnComponent } from '../lib/table/add-column/add-column.component';

import { DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
import { IwTdComponent } from '../lib/table/td/td.component';

@NgModule({
  declarations: [
    AppComponent,
    IwTableComponent,
    IwTheadComponent,
    IwTbodyComponent,
    IwAddColumnComponent,
    IwSelect2Component,
    IwTdComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
