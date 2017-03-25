export interface EditCellEvent {
  newValue: any;
  column: string;
  rowObject: any;
  rowIndex: number;
};

export interface SortColumnEvent {
  column: string;
  direction: string;
};

export interface ToggleSubfieldEvent {
  column: string;
  toggleSubfield: string;
  activeSubfields: string[];
};

export interface RowClickEvent {
  rowIndex: number;
  rowObject: any;
}
