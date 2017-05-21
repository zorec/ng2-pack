import {DefaultValuePipe} from './default-value/default-value.pipe';

import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    DefaultValuePipe,
  ],
  exports: [
    DefaultValuePipe,
  ]
})
export class PipesModule {}
