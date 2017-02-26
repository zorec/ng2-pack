# Ng2Pack

A data table component designed for data-intensive applications. See DEMO here: https://zorec.github.io/ng2-pack/

#### Features:
- visible columns specified by user (UI for adding/removing a column)
- sorting of columns on the client, callbacks for server-side sorting
- column reordering by drag&drop
- client-side or server-side pagination (an easy integration with [ng2-pagination](https://github.com/michaelbromley/ng2-pagination) ) 
- complex data types inside table cells
- inline-editing of table cells
- customize any part of template (e.g. header, footer, cells)

<!--

### Main characteristics

We value flexibility above all! In order to ensure it in various use cases:
  - Components accept a **wide range of inputs** and/or configuration, including internationalization.
  - High-level components are usually composed of **smaller components** that can be used separately.
  - **Low-level utilities** make building and composing components faster and easier
  - Last but not least, you can use **custom templates** while taking advantage of component public API, smaller components or low-level utilities.
  Then you should be able to easily customize components to your desire and use them regardless of your CSS framework.   

Additionally, we follow good practices and style guides:

- **Well-tested**: Both comprehensive test suite and usability testing are necessary to verify that the components work as expected.
- **Testable** Your application should be tested as well and this library will not stand in your way, just the opposite.
- **Convention over configuration**: You should have an easy start despite many inputs and configuration. Intelligent defaults are provided.-->

<!-- There are many other important characteristics (e.g. performance) that are not mentioned here as a main characteristic, but not neglected. 
-->

#### Setup
You can install the package with yarn or npm.
```bash
yarn add ng2-pack
```

Then you can import a module from 'ng2-pack' and use it. You may need to install jQuery and jQuery UI Sortable. These dependencies will be removed from this project soon.  

```ts
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'ng2-pack';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TableModule,
    // other modules ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
<!-- TODO: add setup for AOT! -->

#### Table API: Inputs
- **rows**: data to be displayed in the table rows. Type: Object[]. Required. All other inputs are optional.
- **columnsConfig**: Configuration of a table. Type?: ColumnConfig[]
- **visibleColumns** Ids of initially visible columns in a table. Type?: string[]
- **reorderingEnabled** Enable/Disable drag&drop reordering of columns. Type: boolean
- **inlineEditingEnabled** Enable/Disable inline editing of the data. Type: boolean. Experimental.
- **changeColumnVisibility** Enable/Disable user to select which columns are visible. Type: boolean
- **rowsSortingMode** By default, table rows are sorted client-side. You can use the external mode for server-side sorting. Lastly, the sorting of rows can be disabled completely (no sorting icons).  Type: 'default' | 'external' | 'disabled'
- **initialSortColumn** Set column to be sorted on initialization. Prefix of a column id, either plus or minus sign, specifies the sort direction. Type: string. 
- **language** The default is english ('en'), alternative language is German ('de'). 

#### Table API: Output events:

- **addColumn** A column was added by a user. Event data contain column id. Type: string
- **removeColumn** A column was removed by a user. Event data contain column id. Type: string
- **sortColumn** A column was sorted by a user. Event data contain a tuple with column id and direction, either 'asc' or 'desc'. Type: SortColumnEvent
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


<!--#### Roadmap:

| Feature          | Status              | Docs         |
|------------------|---------------------|--------------|
| Data Table       |               Alpha | [README][1]  |
| Select2          |                 WIP |             -|
| Inline editing   |                 WIP |             -|
| Sortable items   |                 WIP |             -|

[1]: https://github.com/zorec/ng2-pack/blob/master/src/lib/table/README.md-->

### Licence
MIT
