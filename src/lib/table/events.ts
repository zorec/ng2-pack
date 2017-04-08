import { ColumnConfig } from './types';

export enum TableEventType {
  EditCell,
  SortColumn,
  SortColumnInit,
  ToggleSubfield,
  RowClick,
  SetConfig,
  OnChanges,
  AddingColumn,
  AddColumn,
  AddColumnAtPosition,
}

export interface TableEvent {
  type: TableEventType;
}

export interface SortColumnEvent extends TableEvent {
  column: string;
  direction: string;
};

export type SortColumnInit = TableEvent;

export interface ToggleSubfieldEvent extends TableEvent {
  column: string;
  toggleSubfield: string;
  activeSubfields: string[];
};

export interface RowClickEvent extends TableEvent {
  rowIndex: number;
  rowObject: any;
}

export interface AddColumnEvent extends TableEvent {
  value: string;
}

export interface AddColumnAtPositionEvent extends AddColumnEvent {
  atPosition: number;
}

export interface EditCellEvent extends TableEvent {
  newValue: any;
  column: string;
  rowObject: any;
  rowIndex: number;
};

export interface SetConfigEvent extends TableEvent {
  columnsConfig: ColumnConfig[];
}

export type OnChangesEvent = TableEvent;
