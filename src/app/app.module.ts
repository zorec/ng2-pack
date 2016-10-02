import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IwTableComponent } from '../lib/table/table.component';
import { IwSelect2Component } from '../lib/select2/select2.component';
import { IwTheadComponent } from '../lib/table/thead/thead.component';
import { IwTbodyComponent } from '../lib/table/tbody/tbody.component';
import { AddColumnCombobox } from '../lib/table/add-column-combobox/add-column-combobox.component';

import { DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    IwTableComponent,
    IwTheadComponent,
    IwTbodyComponent,
    AddColumnCombobox,
    IwSelect2Component
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
