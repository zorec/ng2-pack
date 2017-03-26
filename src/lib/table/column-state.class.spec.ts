import {ColumnState} from './column-state.class';

describe('ColumnState', () => {
  describe('toggle', () => {
    it('uses initial sort direction if it does not have current state', () => {
      let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'});
      expect(columnState.toggleDirection()).toEqual('desc');
    });

    it('toggles current state', () => {
      let columnState = new ColumnState({id: 'foo', initialSortDirection: 'desc'}, 'asc');
      expect(columnState.toggleDirection()).toEqual('desc');
    });
  });

});
