import { Currency } from './currency';
import { Contragent } from './contragent';

export interface Transaction {
  id: string;
  reference?: string;
  contragent: Contragent;
  currency: Currency;
  dateTime: Date;
  amount: number;
  description: string;
  pending?: boolean;
  extensions?: { [key: string]: any };
}
