import { ChangeDetectionStrategy, Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'iw-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
  @Input() initialPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number;
  @Input() paginationLabel = '';
  @Input() showInput = false;
  @Input() showArrows = true;
  @Output() pageChange = new EventEmitter<number>();

  private _page: number = 1;

  constructor() { }

  ngOnChanges(arg: any) {
    this.page = this.initialPage;
  }

  get page(): number {
    return this._page;
  }

  set page(newPage: number) {
    newPage = Number(newPage);
    if (isNaN(newPage) || newPage === this._page ) { return; }
    if (newPage > 0 && newPage <= this.maxPages) {
      this._page = newPage;
      this.pageChange.emit(newPage);
    } else {
      console.error(`The page '${newPage}' is out of the range. There are pages from 1 to ${this.maxPages}.`);
    }
  }

  get isFirst() {
    return (this.page === 1);
  }

  get isLast() {
    return (this.page === this.maxPages);
  }

  get pageStart(): number {
    return (this.page - 1) * this.itemsPerPage;
  }

  get pageEnd(): number {
    let pageEnd = this.pageStart + this.itemsPerPage;
    if (pageEnd > this.totalItems) {
      pageEnd = this.totalItems;
    }
    return pageEnd;
  }

  get maxPages() {
    let maxPages = this.totalItems / this.itemsPerPage;
    if (maxPages === Math.floor(maxPages)) {
      return maxPages;
    }
    return Math.floor(maxPages) + 1;
  }

  previousPage() {
    this._page = this.page - 1;
  }

  nextPage() {
    this._page = this.page + 1;
  }
}
