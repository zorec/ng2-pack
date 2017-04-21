# Ng2Pack

A collection of components/utilities designed for data-intensive tables.  
See DEMO here: https://zorec.github.io/ng2-pack/

This library provides APIs with different levels of abstraction. The highest abstraction gives you the most comfort. In the case you need more flexibility, you can switch to lower API. If that is not enough, you access even lower-level API. See the examples below for the illustration.

This library is currently under the development so API may change. Please feel free to open issues not only for bug reports, but also for ideas, comments, and questions (support requests). We would love to hear your feedback.

## Installation
You can install the package with yarn or npm.
```bash
yarn add ng2-pack
```

Then just import the table module from 'ng2-pack'.

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

## Getting Started
We follow the philosophy "convention over configuration" to make it easier for you to get started. You can see it from the first code snippet.
<!-- NOTE: add gif -->

0. **Prepare your data** &mdash; an array of objects (a.k.a. rows). Each row object can contain a nested object or an array of objects with simple data types (in other words, two levels of nesting are allowed).
1. **Pass the data as `rows` input**. Other attributes have intelligent defaults.
```html
<iw-table #table [rows]="[{
    name: 'Alan',
    studies: [{university: 'TUM', …}, …],
    address: {country: 'cz', …},
}, …]">
</iw-table>
<!-- HINT: You can display how the column configuration was initialized: <pre>{{ table.columnsConfig | json }} </pre>   -->
```
2. **Adjust according to your needs**. The most important attribute is the column configuration since the initialized values may not be exactly what you want. See the Table API section for the description of all input attributes and output events.

```html
<iw-table
  [rows]="rows"
  [columnsConfig]="columnsConfig"
  [visibleColumns]="visibleColumns"
  reorderingEnabled="true"
  rowsSortingMode="external"
  changeColumnVisibility="true"
  language="de"
  initialSortColumn="firstName"
  (rowClick)="onAction($event, 'Row click at position [' + $event.rowIndex  + ' , ' + $event.columnIndex + ']')"
  (sortColumnInit)="onAction($event, 'Sort init!')"
  (sortColumn)="onAction($event, 'Column `' + $event.column + '` was sorted in the direction `' + $event.direction + '`')"
  (addingColumn)="onAction($event, 'Column is being added at position ' + $event.index)"
  (addColumn)="onAction($event, 'Column ' + $event.column + ' was added')"
  (removeColumn)="onAction($event, 'Column ' + $event.column + ' was removed')"
  (visibleColumnsChange)="onAction($event, 'Visible columns changed to: ' + $event)"
  (editCell)="onAction($event, 'The cell in row ' + $event.rowIndex + ' and column ' + $event.column + ' was edited to value ' + $event.newValue)"
  >
</iw-table>
```

### Additional (advanced) customizations

<!--TODO: wiki page with integrations -->
1. Activate extensions
```html
<iw-table [rows]="paginatedRows" [columnsConfig]="columnsConfig" rowsSortingMode="external">
</iw-table>
<iw-pagination #p [totalItems]="rows.length" (pageChange)="onPageChange(p.pageStart, p.pageEnd)" ></iw-pagination>
```

2. **Customize with your templates** while using handy utilities and subcomponents. Here a custom template for body rows is defined. So that we can make table rows sortable (with directive `iwSortableItem`), and we use application-specific component to modify the look of a specific cell.
```html
<iw-table
  [bodyRowTemplate]="bodyRowTemplate"
  [columnsConfig]="columnsConfig"
  [rows]="rows"
  #tableComponent>
  <template #bodyRowTemplate let-row let-i="index">
    <tr iwSortableItem>
      <template ngFor let-columnName [ngForOf]="tableComponent.visibleColumns">
        <td
          [class]="isCustomField(columnName)"
          *ngIf="!isCustomField(columnName)"
          iw-td
          [column]="tableComponent.columnsLookup[columnName]"
          [row]="row">
        </td>
        <td *ngIf="isCustomField(columnName)">
          <iw-studies-cell
            [row]="row"
            [column]="tableComponent.columnsLookup['studies']">
        </iw-studies-cell>
        </td>
      </template>
      <td *ngIf="tableComponent.changeColumnVisibility"></td>
    </tr>
  </template>
</iw-table>
```
<!-- NOTE: do not use method isCustomField -->


<!--
#### Features:
- visible columns specified by a user (UI for adding/removing a column a.k.a. column toggling)
- sorting of columns on the client, callbacks for server-side sorting
- drag&drop reordering of columns
- client-side or server-side pagination
- complex data types inside table cells
- customize any part of template (e.g. header, footer, cells)
- utilities, e.g. sortableItem
- AOT compatible
-->

<!--

### Design goals

We value flexibility above all! In order to ensure it in various use cases:
  - Components accept a **wide range of inputs** and/or configuration.
  - High-level components are usually composed of **smaller components** that can be used separately.
  - **Low-level utilities** make building and composing components faster and easier
  - Last but not least, you can use **custom templates** while taking advantage of component public API, smaller components or low-level utilities.
  Additionally, you should be able to easily customize any part of the library and use them regardless of your CSS framework.   

We follow good practices and style guides:

- **Well-tested**: Both comprehensive test suite and usability testing are necessary to verify that the components work as expected.
- **Testable** Your application should be tested as well and this library will not stand in your way, just the opposite.
- **Convention over configuration**: You should have an easy start despite many inputs and configuration. Intelligent defaults are provided.-->

<!-- There are many other important characteristics (e.g. performance) that are not mentioned here as a main characteristic, but not neglected.
-->


#### Table API: Inputs
- **rows**: data to be displayed in the table rows. Type: Row. The only required input.
- **columnsConfig**: Configuration of a table. Type?: ColumnConfig[]
- **visibleColumns** Ids of initially visible columns in a table. Type?: string[]. Two-way data binding.
- **reorderingEnabled** Enable/Disable drag&drop reordering of columns. Type: boolean
- **changeColumnVisibility** Enable/Disable user to select which columns are visible. Type: boolean
- **rowsSortingMode** By default, table rows are sorted client-side. You can use the external mode for server-side sorting. Lastly, the sorting of rows can be disabled completely (no sorting icons).  Type: 'default' | 'external' | 'disabled'
- **initialSortColumn** Set column to be sorted on initialization. Optionally put plus or minus sign to specify the sort direction. Type: string.
- **language** The default is english ('en'), alternative language is German ('de').

#### Table API: Output events:

- **addColumn** A column was added by a user. Event data contain column id. Type: AddColumnAtPositionEvent
- **removeColumn** A column was removed by a user. Event data contain column id. Type: RemoveColumnEvent
- **sortColumn** A column was sorted by a user. Type: SortColumnEvent
- **addingColumn** A column is being added at a specific position. Type: AddingColumnEvent
- **toggleSubfield** Triggered when a visibility for a subfield is changed. Type: ToggleSubfieldEvent
- **visibleColumnsChange** This event is trigged whenever a column is added/removed or the order changed.
- **rowClick** Body row was clicked. Event data is row index. Type: RowClickEvent


#### Subcomponents
- TheadComponent
  - ThComponent
  - AddComponent
- Tbodyomponent
  - TdComponent

### Licence
MIT
