# Ng2Pack

A collection of components/utilities designed for data-intensive tables.  
See DEMO here: https://zorec.github.io/ng2-pack/

This library provides an APIs with different levels of abstraction. The highest abstraction gives you the most comfort. In the case you need more flexibility, you can switch to lower API. If that is not enough, you access even lower-level API. See the examples below for the illustration of different APIs.
<!-- We follow the philosophy "convention over configuration", and intelligent defaults are provided. So that you can have an easy start despite many inputs and configuration. -->

This library is currently under the development so API may change. Please feel free to open issues for ideas,  comments, and questions (support requests). We would love to hear your feedback.

#### Example 1: Basic HTML Interface
We follow the philosophy "convention over configuration".
There is only one required input &mdash; rows data attribute. All other attributes have default values. For example, columns configuration is initialized according to row keys and values.

```html
<iw-table [rows]="[{id: 1, name: 'A'}, {id: 2, name: 'B'}]"></iw-table>
```

See the sections about the Table API for the complete list of attributes (inputs and output events).

#### Example 2: Advanced HTML Interface
The table component <iw-table> accepts a custom template inside its tags. But instead of rewriting the template from scratch, you can utilize smaller parts of the table. The following code snippet alters the table style with classes from the CSS framework "Pure CSS". So we just use subcomponents 'iw-theader' and 'iw-tbody' to render the default table header and body. We could provide custom implementation, e.g. summary of table data, pagination.  

```html
<iw-table [rows]="people">
  <!-- Change table styles with classes from Pure CSS framework -->
  <table class="pure-table pure-table-bordered">
    <thead iw-thead></thead>
    <tbody iw-tbody></tbody>
    <!-- Your custom footer goes here  -->
  </table>
</iw-table>
```
We could go even further and customize the table body cells while using even smaller subcomponents.

#### Features:
- visible columns specified by a user (UI for adding/removing a column)
- sorting of columns on the client, callbacks for server-side sorting
- drag&drop reordering of columns
- client-side or server-side pagination
- complex data types inside table cells
- customize any part of template (e.g. header, footer, cells)
- AOT compatible

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

Then you can import a module from 'ng2-pack' and use it. You may need to install Select 2 (the dependency will be removed in the final version).  

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
