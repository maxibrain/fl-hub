import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from '../interfaces';
import { of, Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { pluck } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FinanciesService {
  constructor(private http: HttpClient) {}

  listBankAccounts() {
    return of([
      <BankAccount>{
        name: 'Deposit USD',
        currency: 'USD',
        balance: 2000,
        transactions: [
          {
            id: Guid.create().toString(),
            amount: 2000,
            dateTime: new Date(2019, 7, 1),
            description: 'Initial balance',
          },
        ],
      },
      <BankAccount>{
        name: 'Deposit UAH',
        currency: 'UAH',
        balance: 0,
        transactions: [],
      },
    ]);
    // return this.http.get<BankAccount[]>('api/bank-account');
  }

  getNationalBankExchangeRate(date: Date, currency = 'USD'): Observable<number> {
    return this.http
      .get('https://old.bank.gov.ua/NBUStatService/v1/statdirectory/exchange', {
        params: {
          valcode: currency,
          date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
          json: '',
        },
      })
      .pipe(pluck('0.rate'));
  }
}
