import { Filter, FilterService, FilterTree } from './filter.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'iw-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() set rows(rows: Object[]) {
    if (!rows) { return; }
    this.allRows = rows;
    this.filters = this.filterService.detectFilters(rows);
  }
  @Input() placeholder = 'Type to search';
  // @Input() callback: (item: any) => boolean;
  // @Input() classes = 'filter-input';
  @Output() filter = new EventEmitter<any[]>();

  private allRows: Object[] = [];
  private filters: Filter[] = [];


  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  onFilter(term: string) {
    this.applyValue(this.filters, term);
    let filterTree: FilterTree = {
      operator: 'or',
      filters: this.filters
    };
    let filtered = this.filterService.filterByTree(this.allRows, filterTree);
    this.filter.emit(filtered);
  }

  private applyValue(filters: Filter[], value: string) {
    filters.forEach((f) => {
        if (f.filters) {
          return this.applyValue(f.filters, value);
        } else {
          f.value = value;
        }
    });
  }

}
