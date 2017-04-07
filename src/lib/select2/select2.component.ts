import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
declare var jQuery: any;

export type Select2Option = Select2ItemOption | Select2CategorizedOption;

export interface Select2ItemOption {
  text: string;
  id: string;
}

export interface Select2CategorizedOption {
  text: string;
  children: Select2ItemOption[];
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select2Component),
    multi: true
};

@Component({
  selector: 'iw-select2',
  templateUrl: 'select2.component.html',
  styleUrls: ['select2.component.css'],
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class Select2Component implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {
  // data for select2 dropdown
  @Input() items: Array<Select2Option>;
  @Input() tags: boolean;
  @Input() multiple: boolean;
  @Input() placeholder: string = '';
  @Input() open: boolean = false;

  @Output() close = new EventEmitter();

  currentValue: string;
  private element: any;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.updateData();
  }

  ngOnChanges(arg: any) {
    this.updateData();
  }

  ngOnDestroy() {
    this.removeSelect2();
  }

  // implements ControlValueAccessor
  // write model value into view
  writeValue(v: string) {
    this.currentValue = v;
    if (!this.element) { return; }
    this.element.val(v).trigger('change');
  }

  onChange = (v: string) => {};
  registerOnChange(fn: (v: string) => {}): void {
    this.onChange = fn;
  }
  onTouched = () => {};
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  onClose(e: Event) {
    this.close.emit(e);
  }

  removeSelect2() {
    if (this.element) {
      this.element.off('select2:select');
      this.element.select2('destroy');
      this.element.remove();
      this.element = null;
    }
  }

  updateData() {
    this.removeSelect2();
    // replace a select as a work-around for data not replacing correctly, it was always appending more data
    this.element = jQuery('<select></select>').attr('style', 'width:200px');
    this.element.on('select2:select', (e: Event) => {
      this.currentValue = this.element.val();
      this.onChange(this.currentValue);
    });
    this.element.on('select2:close', (e: Event) => {
      this.onClose(e);
    });
    this.elementRef.nativeElement.appendChild(this.element.get(0));

    this.element.select2({
      data: this.items ||  [],
      // allowClear: true,
      placeholder: this.placeholder,
      multiple: this.multiple,
      tags: this.tags
    });
    this.element.val(this.currentValue).trigger('change');
    if (this.open) {
      this.element.select2('open');
    }
  }
}
