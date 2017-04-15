import {
  Component,
  EventEmitter,
  Input,
  HostListener,
  Output,
  OnChanges
} from '@angular/core';

export interface Item {
  text?: string;
  id: string;
  disabled?: boolean;
}

export interface Category {
  id: string;
  text?: string;
  children: Item[];

  isTheNoCategory?: boolean;
}

export type AnyItem = Category | Item | string;


@Component({
  selector: 'iw-dropdown-select',
  templateUrl: 'dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent implements OnChanges {

  @Input() items: AnyItem[];
  // NOTE: input for hidding categories
  // NOTE: input whather a category is selectable
  @Input() model: Item | string;
  @Input() set isOpen(v: boolean) {
    this._isOpen = v;
  }
  @Input() noSelection: boolean = false;
  @Input() allowClear = true;

  @Input() placeholder: string = 'Please select a value';
  @Input() searchPlaceholder: string = 'Type to search';
  @Input() noOptionsMessage: string = 'No options…';
  // TODO:
  @Input() allowCustom: boolean = false;

  @Output() itemSelected: EventEmitter<any> = new EventEmitter<{ category: Category | undefined, item: Item }>();
  @Output() categorySelected: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() open: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  selectedItem: Item | undefined;
  activeItem: Item;

  private _previousCategories: AnyItem[];
  private _previousModel: Item | string;
  private _inCategories: Category[] = [];
  private _expandedByUser: { [id: string]: boolean } = {};
  public expandedCategories: { [id: string]: boolean } = {};
  displayedCategories: Category[];
  hasOptions: boolean;
  searchQuery: string;
  _isOpen: boolean;

  constructor() { }

  ngOnChanges(arg: any) {
    if (this.items === this._previousCategories && this.model === this._previousModel) {
      return;
    }
    this._previousModel = this.model;
    this._previousCategories = this.items;
    this.updateItems();
    this.updateSelectedItem();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this._isOpen) { return; }
    // NOTE: opening a dropdown with a keyboard shortcut?
    // NOTE: navigation for items with categories

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
    if (this.noSelection) {
      return undefined;
    }
    if (!this.hasOptions) {
      return this.noOptionsMessage;
    }
    return this.selectedItem && this.selectedItem.text;
  }

  onSelectCategory(category: Category) {
    // NOTE: does this make sense?
    this._isOpen = false;
    this.selectedItem = category;
    this.categorySelected.emit(category);
  }

  onSelectItem(item: Item, category: Category) {
    if (item.disabled) { return; }
    this.selectedItem = item;
    // NOTE: Change to item!
    let event: { category: Category | undefined, field: Item };
    if (category.isTheNoCategory) {
      event = { category: undefined, field: item };
    } else {
      event = { category, field: item };
    }
    this._isOpen = false;
    this.itemSelected.emit(event);
  }

  onOpen() {
    this.open.emit();
  }

  onClose() {
    this.close.emit();
  }

  onItemHover(item: Item) {
    this.activeItem = item;
  }

  search(term = '') {
    this.searchQuery = term;
    this.updateDisplayedCategories();
  }

  toggleCategorySubField(cat: Category) {
    this.expandedCategories[cat.id] = !this.expandedCategories[cat.id];
    this._expandedByUser[cat.id] = this.expandedCategories[cat.id];
  }

  clear() {
    this.selectedItem = undefined;
  }

  private getDisplayedItems() {
    return this.displayedCategories
      .filter(cat => cat.isTheNoCategory || this.expandedCategories[cat.id])
      .reduce<Item[]>((prev, value) => prev.concat(value.children), []);
  }

  private getCategoryOfItem(item: Item): Category {
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
      categories = (<Category[]>anyItems).map(c => {
        return {
          id: c.id,
          text: c.text,
          children: c.children
        };
      });
    } else { // we have Item[], we create a fake category
      let items: Item[];
      if (typeof (anyItems[0]) === 'string') {
        items = (<string[]>anyItems).map(item => {
          return {
            id: item,
            text: item
          };
        });
      } else {
        items = <Item[]>anyItems;
      }
      categories = [{
        id: '',
        text: '',
        children: items,
        isTheNoCategory: true
      }];
    }
    this._inCategories = categories;
    this._expandedByUser = {};
    this.expandedCategories = {};
    if (this._inCategories.length === 1) {
      this.expandedCategories[categories[0].id] = true;
    }
    this.updateDisplayedCategories();
  }

  private updateSelectedItem() {
    // this method requires the items are initialized
    if (typeof this.model === 'string' || typeof this.model === 'number') {
      let id: string = <string>this.model;
      for (let category of this._inCategories) {
        for (let item of category.children) {
          if (item.id.toLocaleLowerCase() !== id.toLocaleLowerCase()) { continue; }
          this.expandedCategories[category.id] = true;
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
        isTheNoCategory: category.isTheNoCategory
      };
      if (filteredCategory.children.length > 0) {
        result.push(filteredCategory);
      }
    });
    let expandedByUser = this._expandedByUser;
    let expanded = this.expandedCategories;
    // tslint:disable-next-line:forin
    for (let id in expanded) {
      expanded[id] = expandedByUser[id];
    }
    if (result.length === 1) {
      expanded[result[0].id] = true;
    }
    this.displayedCategories = result;
    this.hasOptions = this.displayedCategories.length > 0;
  }

}
