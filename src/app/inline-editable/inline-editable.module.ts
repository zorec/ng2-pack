import {InlineEditableDirective} from './inline-editable.directive';

import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    InlineEditableDirective
  ],
  exports: [
    InlineEditableDirective,
  ]
})
export class InlineEditableModule {}
