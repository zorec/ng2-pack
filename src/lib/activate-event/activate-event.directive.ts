import {
  Directive,
  ElementRef,
  Input,
  Renderer,
} from '@angular/core';

@Directive({
  selector: '[iwActivateEvent]'
})
export class ActivateEventDirective {
  @Input() set iwActivateEvent(activate: string | boolean) {
    if (activate === 'false' || activate === false) {
      return;
    }
    setTimeout(() => {
      console.log('executing');
      this.renderer.invokeElementMethod(this.element.nativeElement, this.eventName);
    });
  }
  @Input() eventName: string = 'focus';

  constructor(
    private element: ElementRef,
    private renderer: Renderer
  ) { }
}
