import { Currency } from './currency';

export interface Transaction {
  id: string;
  source: 'Bank';
  currency: Currency;
  dateTime: Date;
  amount: number;
  description: string;
  pending?: boolean;
}
