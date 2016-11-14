import {DefaultValuePipe} from './default-value/default-value.pipe';
import {TPipe} from './t/t.pipe';

import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    DefaultValuePipe,
    TPipe,
  ],
  exports: [
    DefaultValuePipe,
    TPipe,
  ]
})
export class PipesModule {}
