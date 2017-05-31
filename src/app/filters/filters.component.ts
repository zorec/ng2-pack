import { FilterService, Filter, FilterTree, FilterType, FilterIndex } from 'lib/filter';
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'iw-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  providers: [FilterService]
})
export class FiltersComponent implements OnInit {
  @Input() rows: any[];
  // @Input() keys: string[];
  @Input() filters: Filter[] = [];
  @Input() overrideFilters: FilterIndex = {};
  @Input() advancedFiltering = false; // Disabled by default.
  @Input() operator: 'and' | 'or' = 'and';
  @Output() filter = new EventEmitter<any[]>();

  constructor(private filterService: FilterService) { }

  ngOnInit() {
    this.filters = this.filterService.detectFilters(this.rows, this.overrideFilters);
    this.createNestedFilters();
  }

  getLabel(filter: Filter) {
    return filter.label ? filter.label : filter.key;
  }

  filterAnyFields(value: any) {
    const filterTree: FilterTree = {
      operator: 'or',
      filters: this.filters.map((f) => {
        f.value = value;
        return f;
      })
    };
    const filtered = this.filterService.filterByTree(this.rows, filterTree);
    this.filter.emit(filtered);
  }

  toggleAdvancedFiltering() {
    this.advancedFiltering = !this.advancedFiltering;
  }

  changeOperator(operator: 'and' | 'or') {
    this.operator = operator;
    this.executeFiltering();
  }

  onFilterChange() {
    this.executeFiltering();
  }

  isSimpleFilter(filter: Filter) {
    return [FilterType.Array, FilterType.Object].indexOf(filter.type) < 0;
  }

  executeFiltering() {
    const filterTree = {
      operator: this.operator,
      filters: this.filters
    };
    const filteredRows = this.filterService.filterByTree(this.rows, filterTree);
    this.filter.emit(filteredRows);
  }

  onNestedFilterChange(filter: Filter, nestedFilter: Filter) {
    filter.value = (<Filter[]>filter.filters).some((nf: any) => nf.value) ? 'any' : undefined;
    this.executeFiltering();
  }

  private createNestedFilters() {
    this.filters.forEach((filter) => {
      const parentFilter = this.filters.find(f => f.key === filter.key);
      if (parentFilter) {
        if (filter.type === FilterType.Array) {
          parentFilter.filters = this.filterService
            .detectFilters(this.getSubRows(filter.key));
        } else if (filter.type === FilterType.Object) {
          parentFilter.filters = this.filterService
            .detectFilters(this.getNestedObjects(filter.key));
        }
      }
    });
  }

  private  getNestedObjects(key: string) {
    return this.rows.reduce((result, row) => {
      result.push(row[key]);
      return result;
    }, []);
  }

  private  getSubRows(key: string) {
    return this.rows.reduce((result, row) => result.concat(row[key]), []);
  }
}
