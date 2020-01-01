import { Transaction, Contragents, Operation } from '../interfaces';
import { Guid } from 'guid-typescript';

export const Null: Operation = {
  transactions: [],
};

export class Income implements Operation {
  readonly transactions: Transaction[];
  constructor(data: { dateTime: Date; usdAmount: number; exchangeRate: number; contragent: string; reference: string }) {
    const reference = data.reference || Guid.create().toString();
    this.transactions = [
      <Transaction>{
        id: Guid.create().toString(),
        reference,
        contragent: { name: data.contragent },
        currency: 'USD',
        amount: data.usdAmount,
        dateTime: data.dateTime || new Date(),
        description: 'Income for exported services',
      },
      <Transaction>{
        id: Guid.create().toString(),
        reference,
        contragent: Contragents.TaxDepartment,
        currency: 'UAH',
        amount: -0.05 * data.usdAmount * data.exchangeRate,
        dateTime: data.dateTime || new Date(),
        description: 'Income tax',
        pending: true,
      },
    ];
  }
}

export class CurrencyExchange implements Operation {
  readonly transactions: Transaction[];
  constructor(data: { dateTime: Date; usdAmount: number; exchangeRate: number; uahAmount: number; uahFee: number }) {
    const reference = Guid.create().toString();
    this.transactions = [
      <Transaction>{
        id: Guid.create().toString(),
        reference,
        contragent: Contragents.Bank,
        currency: 'USD',
        amount: -data.usdAmount,
        dateTime: data.dateTime || new Date(),
        description: 'Currency exchange',
      },
      <Transaction>{
        id: Guid.create().toString(),
        reference,
        contragent: Contragents.Bank,
        currency: 'UAH',
        amount: data.uahAmount,
        dateTime: data.dateTime || new Date(),
        description: `Currency exchange, rate: ${data.exchangeRate}`,
        extensions: {
          exchangeRate: data.exchangeRate,
          uahFee: data.uahFee,
        },
      },
      <Transaction>{
        id: Guid.create().toString(),
        reference,
        contragent: Contragents.Bank,
        currency: 'UAH',
        amount: -data.uahFee,
        dateTime: data.dateTime || new Date(),
        description: `Currency exchange fee`,
      },
    ];
  }
}

export class Payout implements Operation {
  readonly transactions: Transaction[];
  constructor(data: { dateTime: Date; usdAmount?: number; exchangeRate?: number; uahAmount: number; uahFee: number; pending: boolean }) {}
}
