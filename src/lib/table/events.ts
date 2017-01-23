// contains new value, ref to a changed object, column name and row index
export type EditCellEvent = [any, any, string, number];
export type SortColumnEvent = [string, string | undefined];
export type ToggleSubfieldEvent = {column: string, toggleSubfield: string,  activeSubfields: string[]};
