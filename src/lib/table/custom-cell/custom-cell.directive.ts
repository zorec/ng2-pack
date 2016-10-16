import {TbodyComponent} from './../tbody/tbody.component';

import {
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[iwCustomCell]'
})
export class CustomCellDirective {
  @Input() iwCustomCell: string;

  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<ElementRef>,
    private tbodyComponent: TbodyComponent) {
      // this.tbodyComponent.registerCustomCell(this.iwCustomCell, template);
      this.viewContainer.clear();
    }
}
