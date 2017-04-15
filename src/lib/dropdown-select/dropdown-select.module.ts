import { DropdownSelectComponent } from './dropdown-select.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'ngx-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  declarations: [
    DropdownSelectComponent
  ],
  exports: [
    DropdownSelectComponent
  ]
})
export class DropdownSelectModule {

}
