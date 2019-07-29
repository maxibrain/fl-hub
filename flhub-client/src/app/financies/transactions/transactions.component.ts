import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FinanciesState } from '../state/financies.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BankAccount } from '../interfaces';
import * as fromActions from '../state/financies.actions';
import { MatBottomSheet, MatDialog, MatDialogRef } from '@angular/material';
import { Income, CurrencyExchange, Operation } from '../models/operations';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  @Select(FinanciesState.bankAccounts) accounts$: Observable<BankAccount[]>;

  constructor(private store: Store, private _bottomSheet: MatBottomSheet, private dialog: MatDialog) {}

  ngOnInit() {
    this.store.dispatch(new fromActions.ListBankAccounts());
  }

  openTransactionSelect(transactionTypeSelector: TemplateRef<any>): void {
    this._bottomSheet.open(transactionTypeSelector);
  }

  openDialog(event: MouseEvent, dialog: TemplateRef<any>) {
    event.preventDefault();
    this._bottomSheet.dismiss();
    const dialogRef = this.dialog.open(dialog, {
      width: '250px',
      data: {},
    });
    (<any>dialogRef).model = {};
    return false;
  }

  addIncome(dialog: MatDialogRef<any>, model: any) {
    this.submitOperation(dialog, new Income(model));
  }

  addExchange(dialog: MatDialogRef<any>, model: any) {
    this.submitOperation(dialog, new CurrencyExchange(model));
  }

  private submitOperation(dialog: MatDialogRef<any>, op: Operation) {
    this.store.dispatch(new fromActions.AddOperation(op)).subscribe(() => dialog.close());
  }

  completeTransaction(id: string) {
    this.store.dispatch(new fromActions.CompleteTransaction(id));
  }
}
