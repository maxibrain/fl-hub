import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateSearchQuery } from '../state/hire.actions';

@Component({
  selector: 'app-create-query',
  templateUrl: './create-query.component.html',
  styleUrls: ['./create-query.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateQueryComponent {

  readonly form: FormGroup;
  readonly skills: FormControl;

  constructor(fb: FormBuilder, private store: Store) {
    this.skills = fb.control([]);
    this.form = fb.group({
      query: ['', [Validators.required]],
      skills: this.skills,
      maxRate: [999]
    });
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.skills.setValue([...this.skills.value, value.trim()]);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSkill(skill: string): void {
    const skills = <string[]>this.skills.value;
    const index = skills.indexOf(skill);

    if (index >= 0) {
      this.skills.setValue([...skills.slice(0, index), ...skills.slice(index + 1)]);
    }
  }

  submit() {
    this.store.dispatch(new CreateSearchQuery(this.form.value)).subscribe();
  }

}
