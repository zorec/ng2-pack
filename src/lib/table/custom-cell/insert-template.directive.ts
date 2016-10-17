import {ColumnState} from './../column-state.class';

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[iwInsertTemplate]'
})
export class InsertTemplateDirective implements OnInit {
  @Input() iwInsertTemplate: TemplateRef<any>;
  @Input() row: any;
  @Input() column: ColumnState;

  constructor(private viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.insertTemplate();
  }

  insertTemplate() {
    let context: any = {
      row: this.row,
      column: this.column
    };
    let embeddedViewRef: EmbeddedViewRef<any> = this.viewContainer.createEmbeddedView(this.iwInsertTemplate, context);
    console.log(embeddedViewRef.context);
  }
}
