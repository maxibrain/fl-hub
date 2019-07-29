import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

export class IncomeFormGroup extends FormGroup {
  constructor() {
    super({
      usdAmount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      exchangeRate: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });
  }
}

@Component({
  selector: 'app-income-form-group',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field>
        <input matInput type="number" formControlName="usdAmount" placeholder="Amount" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" formControlName="exchangeRate" placeholder="Exchange rate" />
      </mat-form-field>
    </div>
  `,
})
export class IncomeFormGroupComponent {
  @Input() formGroup = new IncomeFormGroup();

  get value() {
    return this.formGroup.value;
  }

  get valid() {
    return this.formGroup.valid;
  }

  get touched() {
    return this.formGroup.touched;
  }
}
