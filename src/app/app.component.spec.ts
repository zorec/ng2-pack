import {IwSelect2Component} from './../lib/select2/select2.component';
import {IwAddColumnComponent} from './../lib/table/add-column/add-column.component';
import {IwTableComponent} from './../lib/table/table.component';
import {IwTbodyComponent} from './../lib/table/tbody/tbody.component';
import {IwTheadComponent} from './../lib/table/thead/thead.component';
/* tslint:disable:no-unused-variable */
import { FormsModule } from '@angular/forms';

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: Ng2Pack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        IwTableComponent,
        IwTheadComponent,
        IwTbodyComponent,
        IwAddColumnComponent,
        IwSelect2Component,
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
