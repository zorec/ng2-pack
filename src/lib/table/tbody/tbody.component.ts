import {ColumnConfig} from '../types';
import {ColumnState} from './../column-state.class';
import {EditCellEvent} from '../events';
import {TableComponent} from './../table.component';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: '[iw-tbody]',
  templateUrl: './tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class TbodyComponent implements AfterViewInit {
  // NOTE: not sure whather this should be a public API
  @Input() addingColumnIndex: number;
  @Input() set inlineEditingEnabled(isEditable: boolean) {
    this.isEditable = isEditable;
  };

  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();

  customTemplate: boolean = false;

  private isEditable: boolean;

  constructor(
    private elementRef: ElementRef,
    private tableComponent: TableComponent
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      // In our template we have N elements, where N is number of rows.
      // If there is more elements, they must be projected => custom template is used
      this.customTemplate = this.elementRef.nativeElement.children.length > this.rows.length;
    });
  }

  get rows(): any[] {
    return this.tableComponent.rows;
  }

  get columnsConfig(): ColumnConfig[] {
    return this.tableComponent.columnsConfig;
  };

  get visibleColumns(): string[] {
    return this.tableComponent.visibleColumns;
  };

  get inlineEditingEnabled() {
    return this.isEditable || this.tableComponent.inlineEditingEnabled;
  }

  column(columnName: string): ColumnState {
    return this.tableComponent.columnsLookup[columnName];
  }

  onRowClicked(index: number) {
    this.rowClick.emit(index);
  }

  onEditCell(editCellEvent: EditCellEvent) {
    this.editCell.emit(editCellEvent);
  }
}
