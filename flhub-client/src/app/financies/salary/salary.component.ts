import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SalaryCalculation, ExchangeStep } from './salary-calculation';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
})
export class SalaryComponent {
  readonly workersFormArray: FormArray;
  readonly salaryForm: FormGroup;
  readonly calc$: Observable<SalaryCalculation>;

  constructor(private fb: FormBuilder) {
    const requiredPositiveNumber = [Validators.required, Validators.min(0)];
    this.workersFormArray = fb.array([]);
    this.salaryForm = fb.group({
      income: [0, requiredPositiveNumber],
      exchangeSteps: fb.array([
        this.createExchangeStep({ part: 0.3, rate: 27, fee: 0.0035 }),
        this.createExchangeStep({ part: 0.7, rate: 27, fee: 0.0015 }),
      ]),
      taxRate: [0.05, requiredPositiveNumber],
      salaryExchangeRate: [27.0, requiredPositiveNumber],
      workers: this.workersFormArray,
      dividentsFee: [0.0035, requiredPositiveNumber],
    });
    this.calc$ = this.salaryForm.valueChanges.pipe(
      startWith(this.salaryForm.value),
      map(f => new SalaryCalculation(f)),
    );
  }

  private createExchangeStep(step: ExchangeStep) {
    return this.fb.group({
      part: [step.part, [Validators.required, Validators.min(0), Validators.max(1)]],
      rate: [step.rate, [Validators.required, Validators.min(0)]],
      fee: [step.fee, [Validators.required, Validators.min(0)]],
    });
  }

  addWorker() {
    this.workersFormArray.push(
      this.fb.group({
        name: ['', [Validators.required]],
        rate: [10, [Validators.required, Validators.min(1)]],
        hours: [1, [Validators.required, Validators.min(0)]],
        fee: [0.0035, [Validators.required, Validators.min(0)]],
      }),
    );
  }

  removeWorker(worker: FormGroup) {
    const index = this.workersFormArray.controls.indexOf(worker);
    if (index > -1) {
      this.workersFormArray.removeAt(index);
    }
  }
}
