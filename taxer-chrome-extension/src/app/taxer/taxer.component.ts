import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction } from '../interfaces';
import { DOCUMENT } from '@angular/common';
import { webSocket } from 'rxjs/webSocket';
import { filter, take, tap, finalize, timeout, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-taxer',
  templateUrl: './taxer.component.html',
  styleUrls: ['./taxer.component.scss'],
})
export class TaxerComponent implements OnInit {
  @Input() transactions: Transaction[];
  get extensionInstalled(): boolean {
    return !!document['taxer-extension'];
  }

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) {}

  ngOnInit() {}

  exportToTaxer() {
    const ws = webSocket('wss://flhub-ws.herokuapp.com/flhub-taxer');
    ws.pipe(
      filter((m: { type: string }) => m.type === 'ping'),
      timeout(3000),
      catchError(err => {
        console.warn('Open https://taxer.ua/ru/my/finances/operations');
        return throwError(err);
      }),
      take(1),
      tap(() => {
        const taxerTransactions = this.transactions
          .filter(t => !(t.amount < 0 && t.currency === 'USD'))
          .map(t => {
            let type: 'Income' | 'Expense' | 'Currency Exchange' = null;
            if (t.currency === 'UAH' && t.amount < 0) {
              type = 'Expense';
            } else if (t.currency === 'USD' && t.amount > 0) {
              type = 'Income';
            } else if (t.currency === 'UAH' && t.amount > 0 && t.extensions.exchangeRate) {
              type = 'Currency Exchange';
            }
            return { ...t, type };
          });
        ws.next({ type: 'addOperationRequest', data: taxerTransactions });
      }),
      finalize(() => ws.complete()),
    ).subscribe();
    ws.next({ type: 'ping' });
  }
}
