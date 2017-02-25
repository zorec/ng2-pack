### Data table
An enhanced table element. See DEMO here: https://zorec.github.io/ng2-pack/

#### Features:
- visible columns specified by user (UI for adding/removing a column)
- sorting of columns on the client, callbacks for server-side sorting
- column reordering by drag&drop
- client-side or server-side pagination (an easy integration with [ng2-pagination](https://github.com/michaelbromley/ng2-pagination) ) 
- complex data types inside table cells
- inline-editing of data
- customize any part of template (e.g. header, footer, cells)

#### Table API: Inputs
- **rows**: data to be displayed in the table rows. Type: Object[]. Required. All other inputs are optional.
- **columnsConfig**: Configuration of a table. Type?: ColumnConfig[]
- **visibleColumns** Ids of initially visible columns in a table. Type?: string[]
- **visibleRowsLimit**: It limits the number of records visible in UI. It is intended for a (client-side) pagination. Type: number
- **reorderingEnabled** Enable/Disable drag&drop reordering of columns. Type: boolean
- **inlineEditingEnabled** Enable/Disable inline editing of the data. Type: boolean. Experimental.
- **changeColumnVisibility** Enable/Disable user to select which columns are visible. Type: boolean
- **rowsSortingMode** By default, table rows are sorted client-side. You can use the external mode for server-side sorting. Lastly, the sorting of rows can be disabled completely (no sorting icons).  Type: 'default' | 'external' | 'disabled'
- **initialSortColumn** Set column to be sorted on initialization. Prefix of a column id, either plus or minus sign, specifies the sort direction. Type: string. 
- **language** The default is english ('en'), alternative language is German ('de'). 

#### Table API: Output events:

- **addColumn** A column was added by a user. Event data contain column id. Type: string
- **removeColumn** A column was removed by a user. Event data contain column id. Type: string
- **sortColumn** A column was sorted by a user. Event data contain a tuple with column id and direction, either 'asc' or 'desc'. Type: [string, string]
- **addingColumn** A column is being added at a specific position. Event data Type. number | undefined
- **reorderColumns** Columns were reordered. Event data contain new order of column ids Type: string[])
- **toggleSubfield** Triggered when a visibility for a subfield is changed. Type: ToggleSubfieldEvent
- **visibleColumns** This event is trigged whenever a column is added/removed or the order changed.
- **rowClick** Row was clicked. Event data is row index. Type: RowClickEvent
- **editCell** This event is triggered when a cell was edited. Type EditCellEvent. Experimental.


### Subcomponents
- TheadComponent
- Tbodyomponent
- ThComponent
- TdComponent
- AddComponent
