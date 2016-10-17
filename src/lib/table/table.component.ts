import {I18nService} from './../services/i18n.service';
import {TableInitService} from './table-init.service';
import {ColumnConfig, ColumnLookup, Row} from './types';
import {EditCellEvent} from './events';
import {TableSortingService} from './table-sorting.service';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'iw-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // TODO: enable encapsulation again
  encapsulation: ViewEncapsulation.None,
  providers: [I18nService]
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() rows: Row[];
  @Input() columnsConfig: ColumnConfig[];
  @Input() set visibleColumns(visibleColumns: string[]) {
    this._visibleColumns = visibleColumns;
    this.visibleColumnsOutput.emit(this._visibleColumns);
  }
  // NOTE: these default value could be specified in a configuration
  @Input() reorderingEnabled: boolean = true;
  @Input() sortingEnabled: boolean = true;
  @Input() inlineEditingEnabled: boolean = false;
  // @Input() columnsForAddingFn: (availableColumns: ColumnConfig[]) => any[] = (id) => id
  @Input() set language(language: string) {
    this.i18nService.language = language;
  }

  @Output() addColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumn: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortColumn: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  @Output() addingColumn: EventEmitter<number> = new EventEmitter<number>();
  @Output() reorderColumns: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() rowClick: EventEmitter<number> = new EventEmitter<number>();
  @Output('visibleColumns') visibleColumnsOutput: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() editCell: EventEmitter<EditCellEvent> = new EventEmitter<EditCellEvent>();

  columnsLookup: ColumnLookup;
  addingColumnIndex: number;
  customTemplate: boolean = false;

  private _visibleColumns: string[];

  constructor(
    public elementRef: ElementRef,
    public tableSortingService: TableSortingService,
    public tableInitService: TableInitService,
    public i18nService: I18nService
  ) {}

  ngOnChanges() {
    this.initializeDefaults();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customTemplate = this.elementRef.nativeElement.children.length !== 1;
    });
  }

  get visibleColumns() {
    return this._visibleColumns;
  }

  onRowClicked(rowClickEvent: number) {
    this.rowClick.emit(rowClickEvent);
  }

  onSortColumn(sortEvent: [string, string]) {
    this.sortColumn.emit(sortEvent);
    this.sortRows(sortEvent);
  }

  onAddingColumn(index: number) {
    this.addingColumnIndex = index;
  }

  sortRows(sortEvent: [string, string]) {
    let [property, direction] = sortEvent;
    this.rows = this.tableSortingService.sort(
      this.rows, this.columnsLookup[property], direction
    );
  }

  private initializeDefaults() {
    if (typeof this.columnsConfig !== 'undefined') {
      this.columnsLookup = this.tableInitService.columnsConfig2Lookup(this.columnsConfig);
    } else {
      [this.columnsLookup, this.columnsConfig] = this.tableInitService.detectColumnConfiguration(this.rows);
    }
    if (typeof this.visibleColumns === 'undefined') {
      this.visibleColumns = Object.keys(this.columnsLookup);
    }
  }
}
