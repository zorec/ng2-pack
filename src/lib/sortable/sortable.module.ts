import { SortableItemDirective } from './sortable-item.directive';

import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    SortableItemDirective
  ],
  exports: [
    SortableItemDirective
  ]
})
export class SortableModule {}
