import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  forwardRef,
  HostListener,
  Output,
  OnChanges,
  Renderer,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface LeafItem {
  text?: string;
  id: string;
  disabled?: boolean;
}

export interface Category {
  id: string;
  text?: string;
  children: LeafItem[];
}

export type Item = Category | LeafItem | string;

export interface SelectItemEvent {
  category: Category | undefined;
  item: LeafItem;
}


const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownSelectComponent),
  multi: true
};

@Component({
  selector: 'iw-dropdown-select',
  templateUrl: 'dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class DropdownSelectComponent implements AfterViewInit, OnChanges, ControlValueAccessor {
  @Input() items: Item[];
  @Input() set isOpen(v: boolean) {
    this._isOpen = v;
  }
  @Input() allowClear = false;
  @Input() isCategorySelectable = false;
  @Input() focusSearch = true;

  @Input() placeholder: string = 'Please select a value';
  @Input() searchPlaceholder: string = 'Type to search';
  @Input() noOptionsMessage: string = 'No options…';
  // NOTE: allow custom values?
  // @Input() allowCustom: boolean = false;

  @Output() itemSelected: EventEmitter<any> = new EventEmitter<SelectItemEvent>();
  @Output() categorySelected: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() open: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @ContentChild(TemplateRef) itemTemplate: any;
  @ViewChild('searchInput') searchInput: ElementRef;

  model: LeafItem | string;
  selectedItem: LeafItem | undefined;
  activeItem: LeafItem;
  isFakeCategory = false;

  private _previousCategories: Item[];
  private _previousModel: LeafItem | string;
  private _inCategories: Category[] = [];
  displayedCategories: Category[];
  hasOptions: boolean;
  searchQuery: string;
  _isOpen: boolean = false;
  propagateChange = (_: any) => {};

  constructor(private renderer: Renderer) { }

  ngOnChanges(arg: any) {
    if (this.items === this._previousCategories && this.model === this._previousModel) {
      return;
    }
    this._previousModel = this.model;
    this._previousCategories = this.items;
    this.updateItems();
    this.updateSelectedItem();
  }

  ngAfterViewInit() {
    this.activateFocus();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this._isOpen) { return; }
    // NOTE: opening a dropdown with a keyboard shortcut?

    let preventDefault = true;
    if (event.key === 'Escape') {
      this._isOpen = false;
    } else if (event.key === 'Enter') {
      let category = this.getCategoryOfItem(this.activeItem);
      this.onSelectItem(this.activeItem, category);
      this._isOpen = false;
    } else if (event.key === 'ArrowUp') {
      let items = this.getDisplayedItems();
      let idx = items.indexOf(this.activeItem);
      if (idx === -1) {
        this.activeItem = items[items.length - 1];
      } else {
        this.activeItem = items[(items.length + idx - 1) % items.length];
      }
    } else if (event.key === 'ArrowDown') {
      let items = this.getDisplayedItems();
      let idx = items.indexOf(this.activeItem);
      if (idx === -1) {
        this.activeItem = items[0];
      } else {
        this.activeItem = items[(idx + 1) % items.length];
      }
    } else {
      preventDefault = false;
    }

    if (preventDefault) {
      event.preventDefault();
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  get itemText(): string | undefined {
    if (!this.hasOptions) {
      return this.noOptionsMessage;
    }
    return this.selectedItem && this.selectedItem.text;
  }

  get isRemoveDisplayed() {
    return (this.allowClear && this.selectedItem);
  }

  writeValue(initialValue: LeafItem | string): void {
    this.model = initialValue;
    this.updateSelectedItem();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {

  }

  onSelectCategory(category: Category) {
    if (this.isCategorySelectable) {
      this._isOpen = false;
      this.selectedItem = category;
      this.categorySelected.emit(category);
    }
  }

  onSelectItem(item: LeafItem, category: Category) {
    if (item.disabled) { return; }
    this.selectedItem = item;
    this.propagateChange(item.id);
    let event: SelectItemEvent = { category, item };
    this._isOpen = false;
    this.itemSelected.emit(event);
  }

  onOpen() {
    this._isOpen = true;
    this.activateFocus();
    this.open.emit();
  }

  onClose() {
    this._isOpen = false;
    this.close.emit();
  }

  onBlur() {
    setTimeout(() => {
      // in timeout so that the possible click event on an item is handled first
      this._isOpen = false;
      this.onClose();
    }, 500);
  }

  onItemHover(item: LeafItem) {
    this.activeItem = item;
  }

  search(term = '') {
    this.searchQuery = term;
    this.updateDisplayedCategories();
  }

  clear() {
    this.propagateChange(undefined);
    this.selectedItem = undefined;
  }

  private activateFocus() {
    if (this.focusSearch && this.searchInput) {
      this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
    }
  }

  private getDisplayedItems() {
    return this.displayedCategories
      // .filter(cat => this.expandedCategories[cat.id])
      .reduce<LeafItem[]>((prev, value) => prev.concat(value.children), []);
  }

  private getCategoryOfItem(item: LeafItem): Category {
    for (let category of this._inCategories) {
      if (category.children.indexOf(item) > -1) {
        return category;
      }
    }
    throw new Error('Could not find Category');
  }

  private updateItems() {
    let anyItems = this.items || [];
    let categories: Category[];
    if (anyItems.length > 0 && (<Category>anyItems[0]).children) { // we have Category[]
      this.isFakeCategory = false;
      categories = (<Category[]>anyItems).map(c => {
        return {
          id: c.id,
          text: c.text,
          children: c.children
        };
      });
    } else { // we have Item[], we create a fake category
      let items: LeafItem[];
      if (typeof (anyItems[0]) === 'string') {
        items = (<string[]>anyItems).map(item => {
          return {
            id: item,
            text: item
          };
        });
      } else {
        items = <LeafItem[]>anyItems;
      }
      this.isFakeCategory = true;
      categories = [{
        id: '',
        text: '',
        children: items,
      }];
    }
    this._inCategories = categories;
    this.updateDisplayedCategories();
  }

  private updateSelectedItem() {
    // this method requires the items are initialized
    if (typeof this.model === 'string' || typeof this.model === 'number') {
      let id: string = <string>this.model;
      for (let category of this._inCategories) {
        for (let item of category.children) {
          if (item.id.toLocaleLowerCase() !== id.toLocaleLowerCase()) { continue; }
          // this.expandedCategories[category.id] = true;
          this.selectedItem = item;
          this.activeItem = item;
          return;
        }
      }
    } else if (this.model !== undefined) {
      this.selectedItem = this.model;
      this.activeItem = this.model;
    }
  }

  private updateDisplayedCategories() {
    let categories = this._inCategories;
    let query = (this.searchQuery || '').toLowerCase();
    let result: Category[] = [];
    categories.forEach(category => {
      let filtered = category.children.filter((item) => {
        const text = item.text || item.id;
        return text.toLowerCase().includes(query);
      });
      let filteredCategory: Category = {
        children: filtered,
        id: category.id,
        text: category.text,
      };
      if (filteredCategory.children.length > 0) {
        result.push(filteredCategory);
      }
    });

    this.displayedCategories = result;
    this.hasOptions = this.displayedCategories.length > 0;
  }

}
