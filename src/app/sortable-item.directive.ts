import {
  ElementRef,
  Directive,
  HostBinding,
  HostListener,
  Input
} from '@angular/core';

// TODO: identification of the "bucket", e.g. rows, columns
// TODO: handle
// NOTE: remove unnecessary arguments, split directive into draggable droppable?

let dragSource: SortableItemDirective;
let temporaryDropSource: SortableItemDirective;

@Directive({
  selector: '[iwSortableItem]'
})
export class SortableItemDirective {
  @HostBinding('attr.draggable') draggable: boolean = true;
  @HostBinding('attr.droppable') droppable: boolean = true;
  @HostBinding('class.sortable-drop-placeholder') dragOver: boolean;
  // @HostBinding('class.sortable-dragged') dragged: boolean;
  // @Input() updateMode: 'dragenter' | 'drop';
  @Input() itemId: number;
  @Input() dropArea: string = 'defaultDropArea';

  @Input() updateElements = (dragged: SortableItemDirective, droppedOn: SortableItemDirective) => {
    let pom = droppedOn.elementRef.nativeElement.innerHTML;
    droppedOn.elementRef.nativeElement.innerHTML = dragged.elementRef.nativeElement.innerHTML;
    dragged.elementRef.nativeElement.innerHTML = pom;
  }



  constructor(public elementRef: ElementRef) {
    // this.itemId = elementRef.nativeElement.parentNode.children.indexOf(elementRef.nativeElement);

    elementRef.nativeElement.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      this.elementRef.nativeElement.removeEventListener('dragover');
    });
  }

  // draggable
  @HostListener('dragstart', ['$event'])
  onDragStart(dragEvent: DragEvent) {
    dragEvent.dataTransfer.effectAllowed = 'move';
    dragSource = this;
    // dragEvent.dataTransfer.setData('text/plain', String(this.itemId));
    // this.dragged = true; // TODO: finish of this event?
  }

  // droppable
  @HostListener('dragenter', ['$event'])
  onDragEnter(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    if (dragSource.itemId !== this.itemId && dragSource.dropArea === this.dropArea && temporaryDropSource !== this) {
      console.log(dragSource, this);
      // temporaryDropSource = this;
      // this.updateElements(dragSource, temporaryDropSource);
    }
  }

  // droppable
  @HostListener('dragleave', ['$event'])
  onDragLeave(dragEvent: DragEvent) {
    console.log('onDragLeave', dragEvent);
    if (dragSource.dropArea === this.dropArea && temporaryDropSource) {
      // this.updateElements(temporaryDropSource, dragSource);
      // temporaryDropSource = null;
      this.dragOver = false;
    }
  }

  // droppable
  @HostListener('dragend', ['$event'])
  onDragEnd(dragEvent: DragEvent) {
    console.log('onDragEnd', dragEvent);
    if (dragSource.dropArea === this.dropArea) {
      this.dragOver = false;
    }
  }


  // droppable
  @HostListener('drop', ['$event'])
  onDrop(dragEvent: DragEvent) {
    dragEvent.stopPropagation();

    console.log('onDrop', dragEvent);
    // do not allow drop on itself
    this.updateElements(dragSource, this);
    // let data: string = JSON.parse(dragEvent.dataTransfer.getData('text/plain'));
    // console.log(data);
  }
}
