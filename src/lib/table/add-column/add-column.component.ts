import {IwColumnConfig} from './../table.component';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'iw-add-column',
  templateUrl: 'add-column.component.html',
  styleUrls: ['add-column.component.css']
})
export class IwAddColumnComponent implements OnChanges {
  @Input() columnsConfig: IwColumnConfig[];
  @Input() visibleColumns: string[];
  // TODO: focus
  @Input() focus: boolean = false;
  @Output('selected') selectedOutput: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  public combobox:boolean = false;
  private value: string = null;
  private items: IwColumnConfig[];
  // private subscription: Subscription;

  constructor () {
  }

  ngOnChanges() {
    // TODO: categorize
    this.items = this.columnsConfig.reduce((items: IwColumnConfig[], columnConfig: IwColumnConfig) => {
      if (this.visibleColumns.indexOf(columnConfig.id) !== -1) {
        return items;
      }
      columnConfig.text = columnConfig.text || columnConfig.id;
      items.push(columnConfig);
      return items;
    }, []);
  }

  public selected(value: string): void {
    if (!value) { return; }
    this.selectedOutput.emit({value});
    setTimeout(() => {
      this.value = null;
    }, 0);
  }

}
