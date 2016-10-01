import {IwColumnLookup} from './../table.component';
import {IwColumnConfig} from './../table.component';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'add-column-combobox',
  templateUrl: 'add-column-combobox.component.html',
  styleUrls: ['add-column-combobox.component.css']
})
export class AddColumnCombobox implements OnChanges {
  public combobox:boolean = false;

  @Input() columnsConfig: IwColumnConfig[];
  @Input() visibleColumns: string[];
  // TODO: focus
  @Input() focus: boolean = false;
  @Output('selected') selectedOutput: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

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
