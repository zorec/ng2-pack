### Data table
An enhanced table element.

Features:
- user defined visible columns (add/remove a column UI)
- sorting of columns
- column reordering by drag&drop
- convention over configuration
```
<iw-table rows="data"></iw-table>
```
- customizable configuration (e.g. custom template, formatters, etc.).

### API
Inputs:
- **rows**: data to be displayed in the table rows. Type: any[]
- **columnsConfig**: Configuration of a table. Type: ColumnConfig[]
- **visibleColumns** Ids of initially visible columns in a table. Type: string[]
- **reorderingEnabled** Enable/Disable drag and drop reordering of columns. Type: boolean;

Output events:

- **addColumn** A column was added by a user.
- **removeColumn** A column was removed by a user.
- **sortColumn** A column was sorted by a user.
- **addingColumn** A column is being added at a specific position.
- **reorderColumns** Columns were reordered
- **rowClick** Row was clicked.
