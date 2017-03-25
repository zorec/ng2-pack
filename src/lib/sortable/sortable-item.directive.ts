import {
  ElementRef,
  Directive,
  HostBinding,
  HostListener,
  Input
} from '@angular/core';

let dragSource: SortableItemDirective;
let originalNextSibling: Element | undefined;

@Directive({
  selector: '[iwSortableItem]'
})
export class SortableItemDirective {
  @HostBinding('attr.draggable') draggable: boolean = true;
  @HostBinding('attr.droppable') droppable: boolean = true;
  @Input() dropArea: string = 'defaultDropArea';

  private lastEvent: string = '';

  constructor(public elementRef: ElementRef) {
  }

  // draggable
  @HostListener('dragstart', ['$event'])
  onDragStart(dragEvent: DragEvent) {
    dragEvent.dataTransfer.effectAllowed = 'move';
    dragSource = this;
    originalNextSibling = this.elementRef.nativeElement.nextSibling;
  }

  // droppable
  @HostListener('dragenter', ['$event'])
  onDragEnter(dragEvent: DragEvent) {
    this.lastEvent = 'dragenter';
    dragEvent.preventDefault();
    if (dragSource !== this && dragSource.dropArea === this.dropArea) {
      // updating is only preview, it is undone if it is not finished by the drop event
      this.updateElements(dragSource, this);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(dragOverEvent: DragEvent) {
    // necessary for drop event to be triggered
    dragOverEvent.preventDefault();
  }

  // droppable
  @HostListener('dragend', ['$event'])
  onDragEnd(dragEvent: DragEvent) {
    if (this.lastEvent === 'drop') { return; }
    if (dragSource.dropArea === this.dropArea && typeof originalNextSibling !== 'undefined') {
      originalNextSibling.parentNode!.insertBefore(dragSource.elementRef.nativeElement, originalNextSibling);
      originalNextSibling = undefined;
    }
  }

  // droppable
  @HostListener('drop', ['$event'])
  onDrop(dropEvent: DragEvent) {
    this.lastEvent = 'drop';
    dropEvent.stopPropagation();
    if (this === dragSource) {
      return;
    }
    // this.updateElements(dragSource, this);
    originalNextSibling = undefined;
  }

  private updateElements = (dragged: SortableItemDirective, droppedOn: SortableItemDirective) => {
    let parent: Element = droppedOn.elementRef.nativeElement.parentNode;
    let draggedEl: Element = dragged.elementRef.nativeElement;
    let dropEl: Element = droppedOn.elementRef.nativeElement;
    let draggedIndex = Array.prototype.indexOf.call(parent.children, draggedEl);
    let dropIndex = Array.prototype.indexOf.call(parent.children, dropEl);
    if (draggedIndex === dropIndex) {
      // do nothing
    } else if (draggedIndex < dropIndex) {
      parent.insertBefore(draggedEl, dropEl.nextSibling || dropEl);
    } else {
      parent.insertBefore(draggedEl, dropEl.previousSibling || dropEl);
    }
  }
}
