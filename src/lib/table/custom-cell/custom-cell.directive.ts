import {TbodyComponent} from './../tbody/tbody.component';

import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[iwCustomCell]'
})
export class CustomCellDirective {
  @Input() set iwCustomCell(columnId: string) {
    this.tbodyComponent.registerCustomCell(columnId, this.template);
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<any>,
    private tbodyComponent: TbodyComponent
  ) {
      // this.viewContainer.clear();
    }
}
