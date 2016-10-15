import {ColumnState} from './column-state.class';

describe('ColumnState', () => {
  it('provided direction is used as first', () => {
    let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'}, 'asc');
    expect(columnState.currentSortDirection).toEqual('asc');
  });

  it('reversed config direction is used as second', () => {
    let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'});
    expect(columnState.currentSortDirection).toEqual('asc');
  });

  it('has default currentSortDirection', () => {
    let columnState = new ColumnState({id: 'foo'});
    expect(columnState.currentSortDirection).toEqual('desc');
  });
});
