import { TableEvent } from './events';
import { ColumnConfig } from './types';

export enum TableEventType {
  AddingColumn,
  AddColumn,
  AddColumnAtPosition,
  EditCell,
  OnChanges,
  RemoveColumn,
  RowClick,
  SortColumn,
  SortColumnInit,
  SetConfig,
  ToggleSubfield,
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

export interface AddingColumnEvent extends TableEvent {
  atPosition: number;
}

export interface AddColumnEvent extends TableEvent {
  value: string;
}

export interface AddColumnAtPositionEvent extends AddColumnEvent {
  atPosition: number;
}

export interface RemoveColumnEvent extends TableEvent {
  column: string;
  index: number;
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
