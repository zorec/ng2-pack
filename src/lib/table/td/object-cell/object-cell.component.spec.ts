import { ColumnState } from './../../column-state.class';
import { TableModule } from './../../table.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCellComponent } from './object-cell.component';

describe('ObjectCellComponent', () => {
  let component: ObjectCellComponent;
  let fixture: ComponentFixture<ObjectCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TableModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectCellComponent);
    component = fixture.componentInstance;
    component.row = {a: {}};
    component.column = new ColumnState({id: 'a'});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
