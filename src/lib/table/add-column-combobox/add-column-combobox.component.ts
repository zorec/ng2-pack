import {IwColumnConfig} from './../table.component';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
// import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'add-column-combobox',
  templateUrl: 'add-column-combobox.component.html',
  styleUrls: ['add-column-combobox.component.css']
})
export class AddColumnCombobox implements OnDestroy {
  public combobox:boolean = false;

  @Input() columnsConfig: IwColumnConfig[];
  // TODO: focus
  @Input() focus: boolean = false;
  @Output('selected') selectedOutput: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  private value: string = null;
  // private subscription: Subscription;

  constructor () {
    // TODO: categorize
    // this doesn't belong here
    // this.subscription = this.peopleService.peopleTableConfiguration.subscribe(v => {
    //   this.data = [];
    //   v.forEach(cat => {
    //     let children = cat.children.filter(col => !col.isVisible);
    //     if (children.length === 0) return;
    //     this.data.push({
    //       text: cat.text,
    //       id: cat.id,
    //       children
    //     });
    //   });
    // });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  public selected(value: string): void {
    if (!value) { return; }
    this.selectedOutput.emit({value});
    setTimeout(() => {
      this.value = null;
    }, 0);
  }

}
