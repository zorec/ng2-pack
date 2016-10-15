import {ColumnConfig} from './types';

export class ColumnState {
  // config is read-only, state is stored in other properties
  constructor (
    public readonly config: ColumnConfig,
    private _currentSortDirection?: string,
    public activeFields: string[] = []
  ) {}

  get currentSortDirection(): string {
    return this._currentSortDirection || this.initialDirection;
  }

  set currentSortDirection(direction: string) {
    this._currentSortDirection = direction;
  }

  private get initialDirection() {
    let direction = this.config.initialSortDirection || 'asc';
    direction = direction.toLowerCase() === 'asc' ? 'desc' : 'asc';
    return direction;
  }
}
