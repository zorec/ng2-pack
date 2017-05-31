import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Filter, FilterType } from 'lib/filter';

@Component({
  selector: 'iw-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent implements OnInit {
  @Input() filter: Filter;
  @Output() change = new EventEmitter<Filter>();

  constructor() { }

  ngOnInit() {
  }

  get FilterType() {
    return FilterType;
  }

  applyFilter(filter: Filter, value: string) {
    filter.value = value;
    this.change.emit(filter);
  }


  itemsForField(filter: Filter) {
    if (filter.options) {
      return filter.options;
    }
    // put to initialization
    // if (!this.rows) { return []; }
    // const items = [];
    // this.rows.forEach((r) => {
    //   if (items.indexOf(r[filter.key]) < 0) {
    //     items.push(r[filter.key]);
    //   }
    // });
    // return items;
  }
}

/*

  filterData(key: string, value: any) {
    let filter: Filter = this.filters
      .find((f) => f.key === key);
    if (!filter) {
      filter = {
        type: FilterType.String, key, value
      };
      this.filters.push(filter);
    } else {
      // overwritte previous value
      filter.value = value;
    }
    this.filterChange.emit();
  }
}

*/
