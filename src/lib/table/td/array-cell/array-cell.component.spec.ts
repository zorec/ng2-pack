import { ColumnState } from './../../column-state.class';
import { TableModule } from './../../table.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayCellComponent } from './array-cell.component';


describe('ArrayCellComponent', () => {
  let component: ArrayCellComponent;
  let fixture: ComponentFixture<ArrayCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TableModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayCellComponent);
    component = fixture.componentInstance;
    component.subrows = [{a: []}];
    component.column = new ColumnState({id: 'a'});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
