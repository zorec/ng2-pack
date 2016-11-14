import {ActivateEventDirective} from './activate-event.directive';

import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    ActivateEventDirective
  ],
  exports: [
    ActivateEventDirective,
  ]
})
export class ActivateEventModule {}
