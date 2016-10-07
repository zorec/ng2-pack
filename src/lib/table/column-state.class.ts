import {ColumnConfig} from './table.component';

export class ColumnState {
  // config is read-only, state is stored in other properties
  constructor (
    public readonly config: ColumnConfig,
    public currentSortDirection?: string,
    public activeFields?: string[]
  ) {}
}
