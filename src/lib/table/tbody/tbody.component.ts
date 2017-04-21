import { TableEvent, TableEventType } from './../events';
import { TableReducerService } from './../table-reducer.service';
import { TableStateService } from './../table-state.service';
import {TdComponent} from './../td/td.component';
import {ColumnConfig, ColumnLookup} from '../types';
import {ColumnState} from './../column-state.class';
import {EditCellEvent, RowClickEvent} from '../events';
import {TableComponent} from './../table.component';

import {
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChild,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: '[iw-tbody]',
  templateUrl: 'tbody.component.html',
  styleUrls: ['./tbody.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TbodyComponent implements OnChanges, OnInit {
  @Input() set rows(rows: any[]) {
    this.tableStateService.rows = rows;
  }
  get rows(): any[] {
    return this.tableStateService.rows;
  }

  @Input() set columnsConfig(columnsConfig: ColumnConfig[]) {
    this.tableStateService.columnsConfig = columnsConfig;
  }
  get columnsConfig(): ColumnConfig[] {
    return this.tableStateService.columnsConfig;
  };

  @Input() set visibleColumns(visibleColumns: string[]) {
    this.tableStateService.visibleColumns = visibleColumns;
  }
  get visibleColumns(): string[] {
    return this.tableStateService.visibleColumns;
  };

  @Input() set changeColumnVisibility(visibility: boolean) {
    this.tableStateService.changeColumnVisibility = visibility;
  }
  get changeColumnVisibility(): boolean {
    return this.tableStateService.changeColumnVisibility;
  }

  @Input() set addingColumnIndex(index: number | undefined) {
    this.tableStateService.addingColumnIndex = index;
  }
  get addingColumnIndex() {
    return this.tableStateService.addingColumnIndex;
  }

  get columnsLookup(): ColumnLookup {
    return this.tableStateService.columnsLookup;
  }

  @Input() bodyRowTemplate: any;

  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();

  @ContentChild(TemplateRef) template: any;

  tableStateService: TableStateService;

  constructor(
    private elementRef: ElementRef,
    private tableReducerService: TableReducerService,
    private changeDetectorRef: ChangeDetectorRef,

    tableStateService: TableStateService,
    @Optional() tableComponent: TableComponent
  ) {
      this.tableStateService = (tableComponent && tableComponent.tableStateService) || tableStateService;
      this.rowClick = this.tableStateService.rowClick;
      this.editCell = this.tableStateService.editCell;
  }

  ngOnInit() {
    this.tableReducerService.nextState.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnChanges(arg: any) {
    this.dispatch({type: TableEventType.OnChanges});
  }

  isSorted(column: ColumnState, direction: string) {
    return this.tableStateService.isSorted(column, direction);
  }

  column(columnName: string): ColumnState {
    return this.columnsLookup[columnName];
  }

  onRowClick(rowIndex: number, rowObject: any, columnIndex: number, column: string) {
    this.rowClick.emit({
      type: TableEventType.RowClick,
      rowIndex,
      rowObject,
      columnIndex,
      column,
    });
  }

  onEditCell(tdComponent: TdComponent, rowIndex: number) {
    if (!tdComponent.isChanged || !tdComponent.column) { return; }
    let editCellEvent: EditCellEvent = {
      type: TableEventType.EditCell,
      newValue: tdComponent.content,
      column: tdComponent.column.config.id,
      rowObject: tdComponent.row,
      rowIndex
    };
    this.editCell.emit(editCellEvent);
  }

  private dispatch(event: TableEvent) {
    this.tableReducerService.reduce(this.tableStateService, event);
  }
}
