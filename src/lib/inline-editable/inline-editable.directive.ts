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

@Directive({
  selector: '[iwInlineEditable]'
})
export class InlineEditableDirective {
  @Input() iwInlineEditable = true;
  @Input() fixedWidth = true;

  @Output() save: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancel: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('attr.contenteditable') get contenteditable() {
    return this.iwInlineEditable && !this.editingEnd;
  }

  originalContent: string | undefined;
  private editingEnd: boolean = false;

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    this.editingEnd = false;
    this.startEditing();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    this.editingEnd = false;
    this.startEditing();
  }

  @HostListener('keydown', ['$event'])
  keyPressed(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.stopPropagation();
        this.saveEditing();
        break;

      case 'Escape':
        this.removeFocus();
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
    this.renderer.setElementProperty(this.element, 'textContent', content);
  }

  startEditing() {
    this.element.nativeElement.setAttribute('title', 'Press enter to save. Escape to cancel editing.');
    if (!this.originalContent) {
      this.originalContent = this.content;
    }
    let originalWidth = this.element.nativeElement.offsetWidth;
    if (this.fixedWidth) {
      this.element.nativeElement.style.width = `${originalWidth}px`;
    }
  }

  saveEditing() {
    if (this.isChanged) {
      this.save.emit(this.content);
      this.originalContent = undefined;
    }
    this.removeFocus();
  }

  cancelEditing() {
    this.cancel.emit(this.originalContent);
    this.content = this.originalContent || '';
    this.removeFocus();
  }

  private removeFocus() {
    this.element.nativeElement.setAttribute('title', '');
    this.editingEnd = true;
    setTimeout(() => {
      // enable editing after a short delay
      this.renderer.invokeElementMethod(this.element.nativeElement, 'click');
    }, 100);
  }
}
