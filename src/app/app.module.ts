import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TableComponent } from '../lib/table/table.component';
import { Select2Component } from '../lib/select2/select2.component';
import { TheadComponent } from '../lib/table/thead/thead.component';
import { TbodyComponent } from '../lib/table/tbody/tbody.component';
import { AddColumnComponent } from '../lib/table/add-column/add-column.component';

import { DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
import { TdComponent } from '../lib/table/td/td.component';
import { ThComponent } from '../lib/table/th/th.component';
import { DefaultValuePipe } from '../lib/pipes/default-value/default-value.pipe';

@NgModule({
  declarations: [
    AppComponent,
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
    HttpModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
