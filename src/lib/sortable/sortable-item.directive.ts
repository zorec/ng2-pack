import {
  ElementRef,
  EventEmitter,
  Directive,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

let dragSource: SortableItemDirective;
let lastPreview: SortableItemDirective | undefined;
let originalNextSibling: Element | undefined;

export interface SortableEvent {
  item: ElementRef;
  ids: string[];
}

@Directive({
  selector: '[iwSortableItem]'
})
export class SortableItemDirective {
  @Input() dropArea: string = 'defaultDropArea';
  @Input() disableSorting = false;
  @Output() sortableDrop = new EventEmitter<SortableEvent>();
  @Output() sortablePreview = new EventEmitter<SortableEvent>();

  private lastEvent: string = '';

  constructor(public elementRef: ElementRef) {
  }

  @HostBinding('attr.draggable') get draggable(): boolean {
    return !this.disableSorting;
  }
  @HostBinding('attr.droppable') get droppable(): boolean {
    return !this.disableSorting;
  };

  // draggable
  @HostListener('dragstart', ['$event'])
  onDragStart(dragEvent: DragEvent) {
    if (this.disableSorting) { return; }
    dragEvent.dataTransfer.effectAllowed = 'move';
    dragSource = this;
    originalNextSibling = this.elementRef.nativeElement.nextSibling;
  }

  // droppable
  @HostListener('dragenter', ['$event'])
  onDragEnter(dragEvent: DragEvent) {
    if (this.disableSorting || lastPreview === this) { return; }
    lastPreview = undefined;
    this.lastEvent = 'dragenter';
    dragEvent.preventDefault();
    if (dragSource !== this && dragSource.dropArea === this.dropArea) {
      // updating is only preview, it is undone if it is not finished by the drop event
      this.updateElements(dragSource, this);
      this.sortablePreview.emit({
        ids: this.parentIds(),
        item: dragSource.elementRef
      });
      lastPreview = this;
      // this.disableSorting = true;
      // setTimeout(() => {
      //   this.disableSorting = false;
      // }, 1000);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(dragOverEvent: DragEvent) {
    if (this.disableSorting) { return; }
    // necessary for drop event to be triggered
    dragOverEvent.preventDefault();
  }

  // droppable
  @HostListener('dragend', ['$event'])
  onDragEnd(dragEvent: DragEvent) {
    if (this.disableSorting || this.lastEvent === 'drop') { return; }
    if (dragSource.dropArea === this.dropArea && typeof originalNextSibling !== 'undefined') {
      originalNextSibling.parentNode!.insertBefore(dragSource.elementRef.nativeElement, originalNextSibling);
      originalNextSibling = undefined;
    }
  }

  // droppable
  @HostListener('drop', ['$event'])
  onDrop(dropEvent: DragEvent) {
    if (this.disableSorting) { return; }
    dropEvent.stopPropagation();
    this.lastEvent = 'drop';
    this.sortableDrop.emit({
      item: this.elementRef,
      ids: this.parentIds()
    });
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

  private parentIds(): string[] {
    let ids: string[] = [];
    this.elementRef.nativeElement.parentElement.childNodes
      .forEach((n: Element) => {
        if (n.id) {
          ids.push(n.id);
        }
      });
    return ids;
  }
}
