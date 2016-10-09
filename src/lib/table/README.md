### Data table
An enhanced table element.

Features:
- visible columns specified by user (UI for adding/removing a column)
- sorting of columns on the client, callbacks for server-side sorting
- column reordering by drag&drop
- custom template with helper directives (see Examples)


#### Table API
Inputs:
- **rows**: data to be displayed in the table rows. Type: Object[]. Required.
- **columnsConfig**: Configuration of a table. Type?: ColumnConfig[]. Optional.
- **visibleColumns** Ids of initially visible columns in a table. Type?: string[]. Optional
- **reorderingEnabled** Enable/Disable drag and drop reordering of columns. Type: boolean;
- **sortingEnabled** Enable/Disable client-side sorting of columns. Type: boolean;

Output events:

- **addColumn** A column was added by a user. Event data contain column id (type: string)
- **removeColumn** A column was removed by a user. Event data contain column id (type: string)
- **sortColumn** A column was sorted by a user. Event data contain an array of two elements(type: string[]): column id and direction either 'asc' or 'desc'.
- **addingColumn** A column is being added at a specific position. Event data (type: number | undefined)
- **reorderColumns** Columns were reordered. Event data contain new order of column ids (type: string[])
- **rowClick** Row was clicked. Event data is row index.
