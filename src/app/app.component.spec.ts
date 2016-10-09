import {TdComponent} from './../lib/table/td/td.component';
import {ThComponent} from './../lib/table/th/th.component';
import {Select2Component} from './../lib/select2/select2.component';
import {AddColumnComponent} from './../lib/table/add-column/add-column.component';
import {TableComponent} from './../lib/table/table.component';
import {TbodyComponent} from './../lib/table/tbody/tbody.component';
import {TheadComponent} from './../lib/table/thead/thead.component';
/* tslint:disable:no-unused-variable */
import { FormsModule } from '@angular/forms';

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: Ng2Pack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TableComponent,
        TheadComponent,
        TbodyComponent,
        ThComponent,
        TdComponent,
        AddColumnComponent,
        Select2Component,
      ],
      imports: [
        FormsModule
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Data Table'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Data Table');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Data Table');
  }));
});
