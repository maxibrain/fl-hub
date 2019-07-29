import { Transaction } from '../interfaces';
import { Guid } from 'guid-typescript';

export interface Operation {
  readonly transactions: Transaction[];
}

export class Income implements Operation {
  readonly transactions: Transaction[];
  constructor(data: { dateTime: Date; usdAmount: number; exchangeRate: number }) {
    this.transactions = [
      <Transaction>{
        id: Guid.create().toString(),
        source: 'Bank',
        currency: 'USD',
        amount: data.usdAmount,
        dateTime: data.dateTime || new Date(),
        description: 'Income for exported services',
      },
      <Transaction>{
        id: Guid.create().toString(),
        source: 'Bank',
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
    this.transactions = [
      <Transaction>{
        id: Guid.create().toString(),
        source: 'Bank',
        currency: 'USD',
        amount: -data.usdAmount,
        dateTime: data.dateTime || new Date(),
        description: 'Currency exchange',
      },
      <Transaction>{
        id: Guid.create().toString(),
        source: 'Bank',
        currency: 'UAH',
        amount: data.uahAmount,
        dateTime: data.dateTime || new Date(),
        description: `Currency exchange, rate: ${data.exchangeRate}`,
      },
      <Transaction>{
        id: Guid.create().toString(),
        source: 'Bank',
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
