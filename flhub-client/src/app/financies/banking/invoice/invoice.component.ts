import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { saveAs } from 'file-saver';
import { BankingService, Client } from '../banking.service';
import { Subject, Observable, combineLatest } from 'rxjs';
import { mergeMap, switchMap, map, startWith, pluck, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  private readonly via = {
    upwork: 'Payment via Upwork Global Inc.',
    payoneer: 'Payment via Payoneer Inc.'
  };
  private readonly refresh$ = new Subject();
  private readonly billingInfo$: Observable<any>;
  readonly clients$: Observable<Client[]>;

  readonly total$: Observable<number>;

  readonly form: FormGroup;
  readonly items: FormArray;

  private get client(): Client {
    return this.form.get('client').value;
  }

  constructor(fb: FormBuilder, private banking: BankingService) {
    this.items = fb.array([]);
    this.form = fb.group({
      invoiceNumber: ['', [Validators.required]],
      from: ['', [Validators.required]],
      client: [undefined, [Validators.required]],
      date: [new Date(), [Validators.required]],
      items: this.items,
      billingInfo: [''],
    });
    this.createItemFormGroup = () =>
      fb.group({
        name: ['', [Validators.required]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unit_cost: [1, [Validators.required, Validators.min(0)]],
      });

    this.total$ = this.form
      .get('items')
      .valueChanges.pipe(map(items => (<[]>items || []).reduce((acc, v: any) => acc + v.quantity * v.unit_cost, 0)));

    this.billingInfo$ = this.refresh$.pipe(
      switchMap(() => banking.getBillingInfo()),
      shareReplay(1),
    );
    this.clients$ = this.billingInfo$.pipe(pluck('clients'));
    this.billingInfo$.subscribe(v => this.form.patchValue({ from: v.supplier, billingInfo: v.billingInfo }));
  }

  private createItemFormGroup: () => FormGroup;

  ngOnInit() {
    this.refresh$.next();
    this.addItem();
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  deleteItem(itemForm) {
    const index = this.items.controls.indexOf(itemForm);
    if (index > -1) {
      this.items.removeAt(index);
    }
  }

  private formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  generate() {
    const invoiceNum = this.form.get('invoiceNumber').value;
    const date = new Date(this.form.get('date').value);
    this.banking
      .generateInvoice({
        from: this.form.get('from').value,
        to: this.client.billingInfo,
        date: this.formatDate(date),
        due_date: this.formatDate(new Date(date.getTime() + 1000 * 60 * 60 * 24 * 30)),
        items: this.form.get('items').value,
        number: invoiceNum,
        notes_title: 'Contractor banking data',
        notes: this.form.get('billingInfo').value,
        terms_title: 'Contract Terms',
        terms:
          'Scope of Services: software development.\r\n' +
          'Terms of payments and acceptance of Services:\r\n' +
          (this.client.via ? this.via[this.client.via] + ' ' : '') +
          'Post payment of 100% upon the services delivery.\r\n' +
          'All charges of correspondent banks are at the Supplier’s expenses. Payment hereof at the same time is the evidence ' +
          'of the service delivery, acceptance thereof in full scope and the confirmation of final mutual installments between ' +
          'Parties. The Parties shall not be liable for nonperformance or improper performance of the obligations under the ' +
          'agreement during the term of insuperable force circumstances. Payment according hereto shall be also the ' +
          'confirmation that Parties have no claims to each other and have no intention to submit any claims. The Parties do ' +
          'not sign Act of provided Services.\r\n' +
          'Jurisdiction:\r\n' +
          'Any disputes arising out of the agreement between the Parties shall be settled by the competent court at the location' +
          'of a defendant.',
      })
      .subscribe(res => saveAs(res, `Invoice # ${invoiceNum}.pdf`));
  }
}
