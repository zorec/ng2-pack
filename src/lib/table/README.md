### Data table
An enhanced table element. See DEMO here: https://zorec.github.io/ng2-pack/

#### Features:
- visible columns specified by user (UI for adding/removing a column)
- sorting of columns on the client, callbacks for server-side sorting
- column reordering by drag&drop
- custom template with helper directives (see Examples)


#### Table API: Inputs
- **rows**: data to be displayed in the table rows. Type: Object[]. Required.
- **columnsConfig**: Configuration of a table. Type?: ColumnConfig[]. Optional.
- **visibleColumns** Ids of initially visible columns in a table. Type?: string[]. Optional
- **reorderingEnabled** Enable/Disable drag and drop reordering of columns. Type: boolean;
- **rowsSortingMode** By default, table rows are sorted client-side. If there are not all records (because of pagination), then the external mode should be used. Lastly, the sorting of rows can be disabled completely.  Type: 'default' | 'external' | 'disabled';

#### Table API: Output events:

- **addColumn** A column was added by a user. Event data contain column id. Type: string
- **removeColumn** A column was removed by a user. Event data contain column id. Type: string
- **sortColumn** A column was sorted by a user. Event data contain a tuple with column id and direction, either 'asc' or 'desc'. Type: [string, string]
- **addingColumn** A column is being added at a specific position. Event data Type. number | undefined
- **reorderColumns** Columns were reordered. Event data contain new order of column. ids Type: string[])
- **rowClick** Row was clicked. Event data is row index. Type: number


### Subcomponents
- TheadComponent
- Tbodyomponent
- ThComponent
- TdComponent
- AddComponent
