import {TdComponent} from './../td/td.component';
import {TableInitService} from './../table-init.service';
import {ColumnConfig, ColumnLookup} from '../types';
import {ColumnState} from './../column-state.class';
import {EditCellEvent, RowClickEvent} from '../events';
import {TableComponent} from './../table.component';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: '[iw-tbody]',
  templateUrl: 'tbody.component.html',
  styleUrls: ['./tbody.component.css']
})
export class TbodyComponent implements AfterViewInit {
  // NOTE: not sure weather this should be a public API
  @Input() addingColumnIndex: number;
  @Input() set inlineEditingEnabled(isEditable: boolean) {
    this.isEditable = isEditable;
  };
  @Input() set rows(rows: any[]) {
    this._rows = rows;
  }
  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this._columnsConfig = columnsConfig;
  }
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
  }

  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();

  customTemplate: boolean = false;

  private _columnsConfig: ColumnConfig[];
  private _columnsLookup: ColumnLookup;
  private _rows: any[];
  private _visibleColumns: string[];
  private isEditable: boolean;
  private tableComponent: TableComponent;
  private customCells: string[] = [];
  private cellTemplates: {[columnId: string]: TemplateRef<any>} = {};

  constructor(
    private elementRef: ElementRef,
    private tableInitService: TableInitService,
    @Optional() tableComponent: TableComponent
  ) {
    this.tableComponent = tableComponent;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // In our template we have N elements, where N is number of rows.
      // If there is more elements, they must be projected => custom template is used
      this.customTemplate = this.elementRef.nativeElement.children.length > this.rows.length;
    });
  }

  get rows(): any[] {
    return this._rows || this.delegateInput('rows', []);
  }

  get columnsConfig(): ColumnConfig[] {
    return this._columnsConfig || this.delegateInput('columnsConfig', []);
  };

  get visibleColumns(): string[] {
    return this._visibleColumns || this.delegateInput('visibleColumns', []);
  };

  get inlineEditingEnabled() {
    return this.isEditable || this.delegateInput('inlineEditingEnabled', false);
  }

  get columnsLookup(): ColumnLookup {
    let columnsLookup = this._columnsLookup ||
      (this.tableComponent && this.tableComponent.columnsLookup);
    if (!columnsLookup) {
      columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
      this._columnsLookup = columnsLookup;
    }
    return columnsLookup;
  }

  get changeColumnVisibility(): boolean {
    return this.tableComponent.changeColumnVisibility;
  }

  isSorted(column: ColumnState, direction: string) {
    return this.tableComponent.isSorted(column, direction);
  }

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  onRowClicked(rowIndex: number, rowObject: any) {
    this.rowClick.emit({
      rowIndex,
      rowObject
    });
  }

  onEditCell(tdComponent: TdComponent, rowIndex: number) {
    if (!tdComponent.isChanged || !tdComponent.column) { return; }
    let editCellEvent: EditCellEvent = {
      newValue: tdComponent.content,
      column: tdComponent.column.config.id,
      rowObject: tdComponent.row,
      rowIndex
    };
    this.editCell.emit(editCellEvent);
  }

  private delegateInput<T>(propertyName: string, defaultValue: T): T {
    if (!this.tableComponent) {
      // console.warn('TbodyComponent: No parent "tableComponent" was found.' +
      //   'Input "' + propertyName + '" was also not provided.');
      return defaultValue;
    }

    return (<any>this.tableComponent)[propertyName] as T;
  }
}
