import {ColumnConfig, SortDirection} from './types';

export class ColumnState {
  // config is read-only, state is stored in other properties
  constructor (
    public readonly config: ColumnConfig,
    private _currentSortDirection?: SortDirection,
    public activeFields: string[] = []
  ) {}

  get initialSortDirection(): SortDirection {
    return this.config.initialSortDirection || 'asc';
  }

  get currentSortDirection(): SortDirection {
    return this._currentSortDirection || 'asc';
  }

  set currentSortDirection(direction: SortDirection) {
    this._currentSortDirection = direction;
  }

  toggleDirection() {
    if (!this._currentSortDirection) {
      this.currentSortDirection = this.initialSortDirection;
    } else {
      this.currentSortDirection = this.currentSortDirection === 'desc' ? 'asc' : 'desc';
    }
    return this.currentSortDirection;
  }

}
