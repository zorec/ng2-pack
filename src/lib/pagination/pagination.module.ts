import { PaginationComponent } from './pagination.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    PaginationComponent
  ],
  exports: [
    PaginationComponent,
  ]
})
export class PaginationModule {

}
