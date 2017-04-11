import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('maxItems', () => {
    it('one page when items per page is greater than total items', () => {
      component.itemsPerPage = 11;
      component.totalItems = 3;
      expect(component.maxPages).toEqual(1);
    });

    it('check boundaries', () => {
      component.itemsPerPage = 9;

      component.totalItems = 35;
      expect(component.maxPages).toEqual(4);

      component.totalItems = 18;
      expect(component.maxPages).toEqual(2);

      component.totalItems = 20;
      expect(component.maxPages).toEqual(3);
    });
  });
});
