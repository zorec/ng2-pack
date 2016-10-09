import {TableComponent, ColumnLookup, ColumnConfig} from './../table.component';
import {ColumnState} from './../column-state.class';

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

  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();

  customTemplate: boolean = false;

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

  column(columnName: string): ColumnState {
    return this.tableComponent.columnsLookup[columnName];
  }

  onRowClicked(index: number) {
    this.rowClick.emit(index);
  }
}
