import { Filter, FilterService, FilterTree } from './filter.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'iw-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() set records(records: Object[]) {
    if (!records) { return; }
    this.allRecords = records;
    this.filters = this.filterService.detectFilters(records);
  }
  @Input() filterTerm: string;
  @Input() instantFiltering = true;
  @Input() placeholder = 'Type to filter';
  @Input() filterText = 'filter';
  // @Input() callback: (item: any) => boolean;
  // @Input() classes = 'filter-input';
  @Output() filter = new EventEmitter<any[]>();

  private allRecords: Object[] = [];
  private filters: Filter[] = [];


  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  onFilter() {
    const term = this.filterTerm;
    this.applyValue(this.filters, term);
    let filterTree: FilterTree = {
      operator: 'or',
      filters: this.filters
    };
    let filtered = this.filterService.filterByTree(this.allRecords, filterTree);
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
