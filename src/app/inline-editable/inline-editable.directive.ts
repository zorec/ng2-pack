import {
  ElementRef,
  EventEmitter,
  Directive,
  Input,
  Output,
  HostBinding,
  HostListener,
  Renderer,
} from '@angular/core';

enum KeyCodes {
  Enter = 13,
  Escape = 27
}

@Directive({
  selector: '[iwInlineEditable]'
})
export class InlineEditableDirective {
  @Input('iwInlineEditable') set iwInlineEditable(isEnabled: boolean) {
    this.contentEditable = isEnabled;
  };

  // @Input() set triggerEvent(triggerEvent: string) {
  //   if (!this.element) {
  //     return;
  //   }
  //   console.log(triggerEvent, this.element);
  //   this.renderer.listen(this.element.nativeElement, triggerEvent, () => {
  //     this.contentEditable = true;
  //   });
  // }

  @Output() onEnter: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.contenteditable') contentEditable: boolean = true;

  originalContent: string;

  @HostListener('focus') startEditing() {
    this.originalContent = this.content;
  }

  @HostListener('keydown', ['$event']) keyPressed(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeyCodes.Enter:
        event.stopPropagation();
        this.onEnter.emit(this.content);
        break;

      case KeyCodes.Escape:
        this.cancelEditing();
        break;
    }
  }

  constructor(
    private element: ElementRef,
    private renderer: Renderer
  ) { }

  get isChanged(): boolean {
    return this.originalContent !== this.content;
  }

  get content(): string {
    return this.element.nativeElement.textContent.trim();
  }

  set content(content: string) {
    this.renderer.setElementProperty(this.element, 'innerText', content);
  }

  cancelEditing() {
    this.content = this.originalContent;
  }
}
