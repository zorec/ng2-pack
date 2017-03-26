import { ElementRef } from '@angular/core';
/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { SortableItemDirective } from './sortable-item.directive';

describe('Directive: SortableItem', () => {
  it('should create an instance', () => {
    const tmp = document.createElement('div');
    let directive = new SortableItemDirective(new ElementRef(tmp));
    expect(directive).toBeTruthy();
  });
});
