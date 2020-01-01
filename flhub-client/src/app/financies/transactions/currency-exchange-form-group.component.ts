import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

export class CurrencyExchangeFormGroup extends FormGroup {
  constructor() {
    super({
      usdAmount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      exchangeRate: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });
  }
}

@Component({
  selector: 'app-currency-exchange-form-group',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field>
        <input matInput type="number" formControlName="usdAmount" placeholder="USD amount" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" formControlName="exchangeRate" placeholder="Exchange rate" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" formControlName="uahAmount" placeholder="UAH amount" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" formControlName="fee" placeholder="Fee" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="number" formControlName="uahFee" placeholder="UAH fee" />
      </mat-form-field>
    </div>
  `,
})
export class CurrencyExchangeFormGroupComponent {
  @Input() formGroup = new CurrencyExchangeFormGroup();

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
