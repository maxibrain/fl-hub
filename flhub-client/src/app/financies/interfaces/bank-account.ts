import { Transaction } from './transaction';
import { Currency } from './currency';

export interface BankAccount {
  name: string;
  currency: Currency;
  transactions: Transaction[];
  balance: number;
}
