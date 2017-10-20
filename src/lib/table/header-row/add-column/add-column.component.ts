import { TableConfigService } from './../../table-config.service';
import {ColumnConfig} from '../../types';
import { AddColumnEvent, TableEvent, TableEventType } from './../../events';
import {TableComponent} from './../../table.component';
import { HeaderRowComponent } from '../header-row.component';
import { LeafItem, Category, SelectItemEvent } from './../../../dropdown-select/dropdown-select.component';
import { TableReducerService } from './../../table-reducer.service';
import { TableStateService } from './../../table-state.service';

import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'iw-add-column',
  templateUrl: 'add-column.component.html',
  styleUrls: ['add-column.component.css'],
  changeDetection: TableConfigService.strategy
})
export class AddColumnComponent implements OnChanges {
  @Input() visibleColumns: string[];
  @Input() open: boolean = true;

  @Output() selected: EventEmitter<AddColumnEvent> = new EventEmitter<AddColumnEvent>();
  @Output() close = new EventEmitter();

  items: (Category | LeafItem)[];
  tableStateService: TableStateService;

  constructor (
    tableStateService: TableStateService,
    public tableReducerService: TableReducerService,
    @Optional() tableComponent: TableComponent,
    @Optional() headerRowComponent: HeaderRowComponent,
    ) {
      this.tableStateService = (tableComponent && tableComponent.tableStateService) ||
        (headerRowComponent  && headerRowComponent.tableStateService) || tableStateService;
  }

  get columnsConfig() {
    return this.tableStateService.columnsConfig;
  }

  ngOnChanges(arg: any) {
    let columns: ColumnConfig[] = this.columnsNotVisibleInTable();
    this.items = this.categorizeColumns(columns);
  }

  onSelected(selection: SelectItemEvent): void {
    this.selected.emit({
      column: selection.item.id,
      type: TableEventType.AddColumn
    });
  }

  onClose() {
    this.close.emit();
  }

  columnsNotVisibleInTable(): ColumnConfig[] {
    let items: ColumnConfig[] = [];
    this.columnsConfig.forEach((columnConfig: ColumnConfig) => {
      if (this.visibleColumns.indexOf(columnConfig.id) === -1) {
        columnConfig.text = columnConfig.text || columnConfig.id;
        items.push(columnConfig);
      }
    });
    return items;
  }

  categorizeColumns(columns: ColumnConfig[]): (Category | LeafItem)[] {
    let itemsWithCategory = columns.filter((item) => typeof item.category !== 'undefined');
    if (itemsWithCategory.length === 0) {
      // no categories present
      return columns.map((column) => {
        return {
          id: column.id,
          text: column.text,
          disabled: false
        };
      });
    }
    let category2Index: {[categoryId: string]: number} = {};
    let index = 0;
    let options: Category[] = [];
    columns.forEach((column: ColumnConfig) => {
      let categoryId = (column.category && column.category.id) || 'Other';
      let categoryIndex = category2Index[categoryId];
      if (typeof categoryIndex === 'undefined') {
        category2Index[categoryId] = index++;
        let option: Category = {
          id: categoryId,
          text: (column.category && column.category.text) || categoryId,
          children: [{
            id: column.id,
            text: column.text,
            disabled: false
          }]
        };
        options.push(option);
      } else {
        options[categoryIndex].children.push(column);
      }
    });
    return options;
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
