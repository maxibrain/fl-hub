import { ControlValueAccessor, FormGroup, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

export class FormGroupValueAccessor implements ControlValueAccessor, OnDestroy, Validator {
  private readonly subs: Subscription;
  private readonly defaultValue: any;
  readonly validationErrorKey: string = this.constructor.name;
  constructor(public readonly formGroup: FormGroup) {
    if (!formGroup) {
      throw new ReferenceError('formGroup is undefined');
    }
    this.defaultValue = formGroup.value;
    this.subs = formGroup.valueChanges.pipe(tap(v => this.onChange(v))).subscribe();
  }

  get valid() {
    return this.formGroup.valid;
  }

  private onChange = _ => {};
  private onTouch = () => {};

  touch() {
    this.onTouch();
  }

  writeValue(obj: any) {
    if (obj) {
      this.formGroup.patchValue(obj);
    } else {
      this.formGroup.reset(this.defaultValue);
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn || (_ => {});
    this.onChange(this.formGroup.value);
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn || (() => {});
    if (this.formGroup.touched) {
      this.onTouch();
    }
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  validate() {
    return this.formGroup.valid
      ? null
      : {
          [this.validationErrorKey]: true,
        };
  }
}
