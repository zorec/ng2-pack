import {ColumnConfig, TableComponent} from './../table.component';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'iw-add-column',
  templateUrl: 'add-column.component.html',
  styleUrls: ['add-column.component.css']
})
export class AddColumnComponent implements OnChanges {
  @Input() visibleColumns: string[];
  // TODO: focus
  @Input() focus: boolean = false;
  @Output('selected') selectedOutput: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  items: ColumnConfig[];
  value: string = null;

  constructor (private tableComponent: TableComponent) {
  }

  ngOnChanges() {
    // TODO: categorize
    let items: ColumnConfig[] = [];
    this.tableComponent.columnsConfig.forEach((columnConfig: ColumnConfig) => {
      if (this.visibleColumns.indexOf(columnConfig.id) === -1) {
        columnConfig.text = columnConfig.text || columnConfig.id;
        items.push(columnConfig);
      }
    });
    this.items = this.tableComponent.columnsForAddingFn(items);
  }

  public selected(value: string): void {
    if (!value) { return; }
    this.selectedOutput.emit({value});
    setTimeout(() => {
      this.value = null;
    }, 0);
  }

}
