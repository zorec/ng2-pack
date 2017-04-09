import {ColumnConfig} from '../types';
import { AddColumnEvent, TableEvent, TableEventType } from './../events';
import {TableComponent} from './../table.component';
import { TheadComponent } from './../thead/thead.component';
import {
  Select2Option,
  Select2CategorizedOption,
  Select2ItemOption
} from '../../select2/select2.component';
import { TableReducerService } from './../table-reducer.service';
import { TableStateService } from './../table-state.service';

import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output
} from '@angular/core';

@Component({
  selector: 'iw-add-column',
  templateUrl: 'add-column.component.html',
  styleUrls: ['add-column.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddColumnComponent implements OnChanges {
  @Input() visibleColumns: string[];
  @Input() open: boolean = true;

  @Output() selected: EventEmitter<AddColumnEvent> = new EventEmitter<AddColumnEvent>();
  @Output() close = new EventEmitter();

  items: Select2Option[];
  value: string | null = null;
  tableStateService: TableStateService;

  constructor (
    tableStateService: TableStateService,
    private tableReducerService: TableReducerService,
    @Optional() tableComponent: TableComponent,
    @Optional() theadComponent: TheadComponent,
    ) {
      this.tableStateService = (tableComponent && tableComponent.tableStateService) ||
        (theadComponent  && theadComponent.tableStateService) || tableStateService;
  }

  get columnsConfig() {
    return this.tableStateService.columnsConfig;
  }

  ngOnChanges(arg: any) {
    let columns: ColumnConfig[] = this.columnsNotVisibleInTable();
    // this.items = this.tableComponent.columnsForAddingFn(options);
    this.items = this.categorizeColumns(columns);
  }

  onSelected(value: string): void {
    if (!value) { return; }
    this.selected.emit({
      column: value,
      type: TableEventType.AddColumn
    });
    setTimeout(() => {
      this.value = null;
    }, 0);
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

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
