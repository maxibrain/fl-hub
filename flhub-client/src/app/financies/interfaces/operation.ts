import { Transaction } from './transaction';

export interface Operation {
  readonly transactions: Transaction[];
}
