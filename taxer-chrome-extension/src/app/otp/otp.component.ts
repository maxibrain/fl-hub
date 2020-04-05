import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, Contragents } from '../interfaces';
import * as $ from 'jquery';
import { MatListOption, MatSelectionList } from '@angular/material';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  private readonly fileContent$ = new Subject<string>();
  readonly parsed$ = this.fileContent$.pipe(map(html => this.parse(html)));

  @ViewChild(MatSelectionList, { static: false }) transactions: MatSelectionList;

  constructor() {}

  onFileChanged(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.fileContent$.next(e.target.result);
      };

      reader.onloadend = (e: any) => {
        fileInput.target.value = '';
      };

      reader.readAsText(fileInput.target.files[0]);
    }
  }

  getTransactions(options: MatListOption[]) {
    return options.map(o => o.value);
  }

  private parse(html: string) {
    const mapStatementItemToTransactions = (transaction: {
      date: string;
      time?: string;
      document: { reference: string };
      amount: { UAH: number; USD?: number };
      description: string;
    }): Transaction[] => {
      if (!transaction.amount.UAH && !transaction.amount.USD) {
        return [];
      }

      const dateParts = transaction.date.split('.');
      const dateTime = new Date(dateParts.reverse().join('-') + 'T' + (transaction.time || '00:00:00'));
      const createTransaction = () => ({
        dateTime,
        reference: transaction.document.reference,
        description: transaction.description,
      });

      if (transaction.description.startsWith('Перерахування коштів для продажу валюти')) {
        return [
          {
            ...createTransaction(),
            type: 'Currency Exchange',
            amount: transaction.amount.USD,
            currency: 'USD',
            contragent: Contragents.Bank,
          },
        ];
      }

      // income
      if (transaction.description === 'Зарахування згідно чинного законодавства (виручка)') {
        return [
          {
            ...createTransaction(),
            type: 'Income',
            amount: transaction.amount.USD,
            contragent: Contragents.Bank,
            currency: 'USD',
          },
        ];
      }

      // tslint:disable-next-line:max-line-length
      const currencyExchangeMatch = /Кошти від продажу ([\d\.\s]+) USD згідно заяви № \d+ від \d{1,2}\/\d{1,2}\/\d{4} курс ([\d\.\s]+) Комісія ([\d\.\s]+)/g.exec(
        transaction.description,
      );
      if (currencyExchangeMatch) {
        const usdAmount = parseFloat(currencyExchangeMatch[1].replace(' ', ''));
        const fee = parseFloat(currencyExchangeMatch[3].replace(' ', ''));
        return [
          {
            ...createTransaction(),
            type: 'Currency Exchange',
            amount: transaction.amount.UAH + fee,
            currency: 'UAH',
            contragent: Contragents.Bank,
            extensions: {
              usdAmount,
              exchangeRate: parseFloat(currencyExchangeMatch[2].replace(' ', '')),
            },
          },
          {
            ...createTransaction(),
            type: 'Expense',
            amount: -fee,
            currency: 'UAH',
            contragent: Contragents.Bank,
            description: 'Currency exchange fee',
          },
        ];
      }

      if (transaction.description.startsWith('Комісія банку за ведення рахунків')) {
        return [
          {
            ...createTransaction(),
            type: 'Expense',
            amount: transaction.amount.UAH,
            currency: 'UAH',
            contragent: Contragents.Bank,
          },
        ];
      }

      if (transaction.description === 'Перевод личных средств') {
        return [
          {
            ...createTransaction(),
            type: 'Expense',
            amount: transaction.amount.UAH,
            currency: 'UAH',
            contragent: Contragents.PersonalAccount,
          },
        ];
      }

      // Tax
      const taxMatch =
        transaction.description.match(/\*;101;\d+;Сплата ЄСВ за III квартал 2019 року, 22%;;;/g) ||
        transaction.description.match(/\*;101;\d+; сплата единого податку/);
      if (taxMatch) {
        return [
          {
            ...createTransaction(),
            type: 'Expense',
            amount: transaction.amount.UAH,
            currency: 'UAH',
            contragent: Contragents.TaxDepartment,
          },
        ];
      }

      return [
        {
          ...createTransaction(),
          amount: transaction.amount.UAH,
          currency: 'UAH',
          contragent: Contragents.Unknown,
        },
        {
          ...createTransaction(),
          amount: transaction.amount.USD,
          currency: 'USD',
          contragent: Contragents.Unknown,
        },
      ];
    };

    const $html = $(html.replace(/&nbsp;/g, '').replace(/\n/g, ''));
    const $rows = $html.filter('table').find('tr');
    const $customerDataRows = $rows.filter('tr[style="height:18px"]:has(td.s3)');
    const $customerDataCells = $customerDataRows.find('td.s3');
    const accounts = [0, 1].map(ai => {
      const accountData = new Array(5).fill(0).map((_, j) => $customerDataCells[ai * 5 + j].innerText);
      const currency = accountData[4];
      const $lastCustomerDataRow = $customerDataRows.eq(ai * 4 + 3);
      const $accountRows = $rows.slice($rows.index($lastCustomerDataRow) + 1, $rows.index($customerDataRows.eq(ai * 4 + 4)));

      const transactions: Array<Transaction> = [];
      const $activityDates = $accountRows.find('td.s15');
      for (const activityDate of $activityDates) {
        const $activityDate = $(activityDate);
        const $transactionsRows = $activityDate
          .parent()
          .nextUntil('tr:has(td.s25)')
          .slice(2)
          .filter('tr:has(td:not(:empty))');
        if (currency === 'UAH') {
          const rowsPerTransaction = 3;
          for (let j = 0; j < $transactionsRows.length / rowsPerTransaction; j++) {
            const $transactionRows = $transactionsRows.slice(j * rowsPerTransaction, (j + 1) * rowsPerTransaction);
            const $firstRowCells = $transactionRows.eq(0).children();
            const amount =
              parseFloat(($firstRowCells.eq(7).text() || '0').replace(' ', '')) -
              parseFloat(($firstRowCells.eq(6).text() || '0').replace(' ', ''));
            const transaction = {
              date: $activityDate.text(),
              time: $transactionRows
                .eq(1)
                .children()
                .eq(2)
                .text(),
              document: {
                reference: $firstRowCells.eq(4).text(),
                type: $firstRowCells.eq(5).text(),
              },
              contragent: {
                account: $firstRowCells.eq(1).text(),
                name: $transactionRows
                  .eq(2)
                  .children()
                  .eq(1)
                  .text(),
                taxId: $firstRowCells.eq(2).text(),
                bankCode: $firstRowCells.eq(3).text(),
                bankName: $transactionRows
                  .eq(2)
                  .children()
                  .last()
                  .text(),
              },
              amount: {
                UAH: amount,
              },
              fee: $firstRowCells.eq(8).text(),
              description: $firstRowCells.last().text(),
              // rows: Array.from($transactionRows).map((v: any) => v.innerHTML),
            };

            transactions.push(...mapStatementItemToTransactions(transaction));
          }
        } else if (currency === 'USD') {
          const rowsPerTransaction = 2;
          for (let j = 0; j < $transactionsRows.length / rowsPerTransaction; j++) {
            const $transactionRows = $transactionsRows.slice(j * rowsPerTransaction, (j + 1) * rowsPerTransaction);
            const $firstRowCells = $transactionRows.eq(0).children();
            const usdAmount =
              parseFloat(($firstRowCells.eq(7).text() || '0').replace(' ', '')) -
              parseFloat(($firstRowCells.eq(6).text() || '0').replace(' ', ''));
            const uahAmount =
              parseFloat(($firstRowCells.eq(9).text() || '0').replace(' ', '')) -
              parseFloat(($firstRowCells.eq(8).text() || '0').replace(' ', ''));
            const transaction = {
              date: $activityDate.text(),
              document: {
                reference: $firstRowCells.eq(2).text(),
              },
              contragent: {
                account: $firstRowCells.eq(1).text(),
                bankName: $transactionRows
                  .eq(1)
                  .children()
                  .eq(1)
                  .text(),
              },
              amount: {
                UAH: uahAmount,
                USD: usdAmount,
              },
              description: $firstRowCells.last().text(),
            };

            transactions.push(...mapStatementItemToTransactions(transaction));
          }
        }
      }
      return {
        name: accountData[0],
        taxId: accountData[1],
        address: accountData[2],
        number: accountData[3],
        currency: accountData[4],
        transactions,
      };
    });
    return {
      account: accounts[0],
      transactions: accounts
        .reduce<Array<Transaction>>((acc, a) => [...acc, ...a.transactions], [])
        .sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1)),
    };
  }
}
