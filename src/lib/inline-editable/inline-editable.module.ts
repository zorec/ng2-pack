import {NgModule} from '@angular/core';
import {InlineEditableDirective} from './inline-editable.directive';

@NgModule({
  declarations: [
    InlineEditableDirective
  ],
  exports: [
    InlineEditableDirective,
  ]
})
export class InlineEditableModule {}
