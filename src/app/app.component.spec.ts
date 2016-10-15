import {StudiesCellComponent} from './table-example/studies-cell.component';
import {TableModule} from './../lib/table/table.module';
/* tslint:disable:no-unused-variable */
import { FormsModule } from '@angular/forms';

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: Ng2Pack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StudiesCellComponent
      ],
      imports: [
        FormsModule,
        TableModule
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
