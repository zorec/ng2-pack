import {ColumnConfig} from './types';

export class ColumnState {
  // config is read-only, state is stored in other properties
  constructor (
    public readonly config: ColumnConfig,
    private _currentSortDirection?: string,
    public activeFields: string[] = []
  ) {}

  get initialSortDirection() {
    return this.config.initialSortDirection || 'asc';
  }

  get currentSortDirection(): string {
    return this._currentSortDirection || 'asc';
  }

  set currentSortDirection(direction: string) {
    this._currentSortDirection = direction.toLowerCase();
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
