import {ColumnConfig} from '../types';
import {Select2Option, Select2CategorizedOption, Select2ItemOption} from '../../select2/select2.component';
import {TableComponent} from './../table.component';

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'iw-add-column',
  templateUrl: 'add-column.component.html',
  styleUrls: ['add-column.component.css']
})
export class AddColumnComponent implements OnChanges {
  @Input() visibleColumns: string[];
  @Input() open: boolean = true;

  @Output() selected: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();
  @Output() close = new EventEmitter();

  items: Select2Option[];
  value: string | null = null;

  constructor (private tableComponent: TableComponent) {
  }

  ngOnChanges(arg: any) {
    let columns: ColumnConfig[] = this.columnsNotVisibleInTable();
    // this.items = this.tableComponent.columnsForAddingFn(options);
    this.items = this.categorizeColumns(columns);
  }

  onSelected(value: string): void {
    if (!value) { return; }
    this.selected.emit({value});
    setTimeout(() => {
      this.value = null;
    }, 0);
  }

  columnsNotVisibleInTable(): ColumnConfig[] {
    let items: ColumnConfig[] = [];
    this.tableComponent.columnsConfig.forEach((columnConfig: ColumnConfig) => {
      if (this.visibleColumns.indexOf(columnConfig.id) === -1) {
        columnConfig.text = columnConfig.text || columnConfig.id;
        items.push(columnConfig);
      }
    });
    return items;
  }

  categorizeColumns(columns: ColumnConfig[]): Select2Option[] {
    let itemsWithCategory = columns.filter((item) => typeof item.category !== 'undefined');
    if (itemsWithCategory.length === 0) {
      // no categories present
      return <Select2ItemOption[]>columns;
    }
    let category2Index: {[categoryId: string]: number} = {};
    let index = 0;
    let options: Select2CategorizedOption[] = [];
    columns.forEach((column: ColumnConfig) => {
      let categoryId = (column.category && column.category.id) || 'Other';
      let categoryIndex = category2Index[categoryId];
      if (typeof categoryIndex === 'undefined') {
        category2Index[categoryId] = index++;
        let option: Select2CategorizedOption = {
          text: (column.category && column.category.text) || categoryId,
          children: [<Select2ItemOption>column]
        };
        options.push(option);
      } else {
        options[categoryIndex].children.push(<Select2ItemOption>column);
      }
    });
    return options;
  }

}
