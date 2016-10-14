import {ColumnConfig} from '../types';
import {Select2Options} from '../../select2/select2.component';
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

  @Output('selected') selectedOutput: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();
  @Output() close = new EventEmitter();

  items: Select2Options[];
  value: string = null;

  constructor (private tableComponent: TableComponent) {
  }

  ngOnChanges() {
    let columns: ColumnConfig[] = this.columnsNotVisibleInTable();
    let options: Select2Options[] = this.categorizeColumns(columns);
    this.items = this.tableComponent.columnsForAddingFn(options);
  }

  selected(value: string): void {
    if (!value) { return; }
    this.selectedOutput.emit({value});
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

  categorizeColumns(columns: ColumnConfig[]): Select2Options[] {
    let itemsWithCategory = columns.filter((item) => typeof item.category !== 'undefined');
    if (itemsWithCategory.length === 0) {
      // no categories present
      return <Select2Options[]>columns;
    }
    let category2Index: {[categoryId: string]: number} = {};
    let index = 0;
    let options: Select2Options[] = [];
    columns.forEach((column: ColumnConfig) => {
      let categoryId = (column.category && column.category.id) || 'Other';
      let categoryIndex = category2Index[categoryId];
      if (typeof categoryIndex === 'undefined') {
        category2Index[categoryId] = index++;
        let option: Select2Options = {
          id: categoryId,
          text: (column.category && column.category.text) || categoryId,
          children: [<Select2Options>column]
        };
        options.push(option);
      } else {
        options[categoryIndex].children.push(<Select2Options>column);
      }
    });
    return options;
  }

}
