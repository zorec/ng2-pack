import { FilterService } from './filter.service';
import { FilterComponent } from './filter.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
  ],
  declarations: [
    FilterComponent
  ],
  exports: [
    FilterComponent,
  ],
  providers: [
    FilterService
  ]
})
export class FilterModule {

}
