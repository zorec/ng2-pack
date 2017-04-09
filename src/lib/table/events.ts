import { TableEvent } from './events';
import { ColumnConfig } from './types';

export enum TableEventType {
  AddingColumn,
  AddingAdjacentColumn,
  AddColumn,
  AddColumnAtPosition,
  EditCell,
  DragPreview,
  DragEnd,
  DropColumn,
  OnChanges, // internal
  RemoveColumn,
  RowClick,
  SetConfig,
  SortColumn,
  SortColumnInit,
  ToggleSubfield,
}

export enum AdjacentDirection {
  Left = 0,
  Right = 1,
}

export interface TableEvent {
  type: TableEventType;
}

export interface AddingColumnEvent {
  type: TableEventType.AddingColumn;
  index: number;
}

export interface AddingAdjacentEvent {
  type: TableEventType.AddingAdjacentColumn;
  index: AdjacentDirection;
}

export interface AddColumnEvent {
  type: TableEventType.AddColumn;
  column: string;
}

export interface AddColumnAtPositionEvent {
  type: TableEventType.AddColumnAtPosition;
  column: string;
  index: number;
}

export interface EditCellEvent {
  type: TableEventType.EditCell;
  newValue: any;
  column: string;
  rowObject: any;
  rowIndex: number;
};

export interface DragPreviewEvent {
  type: TableEventType.DragPreview;
  columns: string[];
}

export interface DragPreviewRevertEvent {
  type: TableEventType.DragEnd;
}

export interface DropEvent {
  type: TableEventType.DropColumn;
}

export interface RemoveColumnEvent {
  type: TableEventType.RemoveColumn;
  column: string;
  index: number;
}

export interface RowClickEvent {
  type: TableEventType.RowClick;
  rowIndex: number;
  rowObject: any;
}

export interface SetConfigEvent {
  type: TableEventType.SetConfig;
  columnsConfig: ColumnConfig[];
}

export interface SortColumnEvent {
  type: TableEventType.SortColumn;
  column: string;
  direction: string;
};

export interface SortColumnInit {
  type: TableEventType.SortColumnInit;
};

export interface ToggleSubfieldEvent {
  type: TableEventType.ToggleSubfield;
  column: string;
  toggleSubfield: string;
  activeSubfields: string[];
};
